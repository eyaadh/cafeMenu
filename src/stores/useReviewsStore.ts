import { defineStore } from "pinia";
import { ref, onUnmounted, computed } from "vue";
import { db } from "@/utils/firebase"; // Assuming auth is not needed here
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import type { IReview } from "@/types/Reviews";

export const useReviewsStore = defineStore("reviews", () => {
  const reviews = ref<IReview[]>([]);
  const unsubscribe = ref<Unsubscribe | null>(null);

  // Fetch documents and listen for real-time updates
  const fetchReviews = () => {
    const colRef = collection(db, "reviews");
    unsubscribe.value = onSnapshot(
      colRef,
      (snapshot) => {
        reviews.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as IReview[];
      },
      (error) => {
        console.error("Error fetching documents:", error);
      },
    );
  };

  // Add a new product
  const addReview = async (newReview: IReview) => {
    try {
      const colRef = collection(db, "reviews");
      const docRef = await addDoc(colRef, newReview);

      // update the document with the auto-generated ID
      await updateDoc(doc(db, "reviews", docRef.id), { id: docRef.id });

      // finally update the doc restriction
      await updateDoc(doc(db, "reviews", docRef.id), { restricted: true });

      console.log(`Review added successfully with ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  // Update a product
  const editReview = async (docId: string, newData: Partial<IReview>) => {
    try {
      const docRef = doc(db, "reviews", docId);
      await updateDoc(docRef, newData);
      console.log("Review updated successfully");
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  // Delete a product
  const deleteReview = async (docId: string) => {
    try {
      const docRef = doc(db, "reviews", docId);
      await deleteDoc(docRef);
      console.log("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Filter only approved reviews
  const approvedReviews = computed(() => {
    return reviews.value.filter((review) => review.status === "approved");
  });

  // Initialize the store by fetching products
  fetchReviews();

  // Clean up the listener when the store is no longer used
  onUnmounted(() => {
    if (unsubscribe.value) {
      unsubscribe.value();
    }
  });

  return {
    reviews,
    addReview,
    editReview,
    deleteReview,
    approvedReviews,
  };
});
