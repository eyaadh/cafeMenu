import { defineStore } from "pinia";
import { onUnmounted, ref } from "vue";
import { db } from "@/utils/firebase"; // Assuming auth is not needed here
import type { Unsubscribe } from "firebase/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const useSystemSettingsStore = defineStore("systemSettings", () => {
  const settings = ref<any[]>([]);
  const unsubscribe = ref<Unsubscribe | null>(null);

  // Fetch documents and listen for real-time updates
  const fetchSettings = () => {
    const colRef = collection(db, "systemSettings");
    unsubscribe.value = onSnapshot(
      colRef,
      (snapshot) => {
        settings.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      },
      (error) => {
        console.error("Error fetching system settings documents:", error);
      },
    );
  };

  const fetchSetting = async (settingName: string) => {
    try {
      // Create a reference to the collection
      const colRef = collection(db, "systemSettings");

      // Create a query to find the document with the specific "name" field
      const q = query(colRef, where("name", "==", settingName));

      // Fetch the document(s)
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the first matching document's data (assuming only one match)
        return querySnapshot.docs[0].data();
      } else {
        // Document doesn't exist
        return null;
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      throw error;
    }
  };

  // Add a new product
  const addSetting = async (newSetting: any) => {
    try {
      const colRef = collection(db, "systemSettings");
      const docRef = await addDoc(colRef, newSetting);

      // update the document with the auto-generated ID
      await updateDoc(doc(db, "systemSettings", docRef.id), { id: docRef.id });

      console.log(`Category added successfully with ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Update a product
  const editSetting = async (
    settingName: string,
    newData: Partial<any>,
  ): Promise<void> => {
    // Create a reference to the collection
    const colRef = collection(db, "systemSettings");

    // Create a query to find the document with the specific "name" field
    const q = query(colRef, where("name", "==", settingName));

    try {
      // Fetch the document(s)
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the first matching document's ID
        const docId = querySnapshot.docs[0].id;
        const docRef = doc(db, "systemSettings", docId);

        // Update the document with the new data
        await updateDoc(docRef, newData);
        console.log("Settings updated successfully");
        return Promise.resolve(); // Resolve the promise
      } else {
        // Document doesn't exist
        return Promise.reject(
          `Document doesn't exist with setting name: ${settingName}`,
        ); // Reject the promise
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      return Promise.reject(error); // Reject the promise on error
    }
  };

  // Delete a product
  const deleteSetting = async (docId: string) => {
    try {
      const docRef = doc(db, "systemSettings", docId);
      await deleteDoc(docRef);
      console.log("Settings deleted successfully");
    } catch (error) {
      console.error("Error deleting settings:", error);
    }
  };

  // Initialize the store by fetching products
  fetchSettings();

  // Clean up the listener when the store is no longer used
  onUnmounted(() => {
    if (unsubscribe.value) {
      unsubscribe.value();
    }
  });

  return {
    settings,
    addSetting,
    editSetting,
    deleteSetting,
    fetchSetting,
  };
});
