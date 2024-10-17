import { defineStore } from "pinia";
import { ref, onUnmounted } from "vue";
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
import type { ICategory } from "@/types/Categories";

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<ICategory[]>([]);
  const unsubscribe = ref<Unsubscribe | null>(null);

  // Fetch documents and listen for real-time updates
  const fetchCategories = () => {
    const colRef = collection(db, "categories");
    unsubscribe.value = onSnapshot(
      colRef,
      (snapshot) => {
        categories.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ICategory[];
      },
      (error) => {
        console.error("Error fetching category documents:", error);
      },
    );
  };

  // Add a new product
  const addCategory = async (newCategory: ICategory) => {
    try {
      const colRef = collection(db, "categories");
      const docRef = await addDoc(colRef, newCategory);

      // update the document with the auto-generated ID
      await updateDoc(doc(db, "categories", docRef.id), { id: docRef.id });

      console.log(`Category added successfully with ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Update a product
  const editCategory = async (docId: string, newData: Partial<ICategory>) => {
    try {
      const docRef = doc(db, "categories", docId);
      await updateDoc(docRef, newData);
      console.log("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Delete a product
  const deleteCategory = async (docId: string) => {
    try {
      const docRef = doc(db, "categories", docId);
      await deleteDoc(docRef);
      console.log("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Initialize the store by fetching products
  fetchCategories();

  // Clean up the listener when the store is no longer used
  onUnmounted(() => {
    if (unsubscribe.value) {
      unsubscribe.value();
    }
  });

  return {
    categories,
    addCategory,
    editCategory,
    deleteCategory,
  };
});
