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
import type { IProduct } from "@/types/Products";

export const useProductsStore = defineStore("products", () => {
  const products = ref<IProduct[]>([]);
  const unsubscribe = ref<Unsubscribe | null>(null);

  // Fetch documents and listen for real-time updates
  const fetchProducts = () => {
    const colRef = collection(db, "products");
    unsubscribe.value = onSnapshot(
      colRef,
      (snapshot) => {
        products.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as IProduct[]; // Cast to IProduct[]
      },
      (error) => {
        console.error("Error fetching documents:", error);
      },
    );
  };

  // Add a new product
  const addProduct = async (newProduct: IProduct) => {
    try {
      const colRef = collection(db, "products");
      const docRef = await addDoc(colRef, newProduct);

      // update the document with the auto-generated ID
      await updateDoc(doc(db, "products", docRef.id), { id: docRef.id });

      console.log(`Product added successfully with ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Update a product
  const editProduct = async (docId: string, newData: Partial<IProduct>) => {
    try {
      const docRef = doc(db, "products", docId);
      await updateDoc(docRef, newData);
      console.log("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete a product
  const deleteProduct = async (docId: string) => {
    try {
      const docRef = doc(db, "products", docId);
      await deleteDoc(docRef);
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Initialize the store by fetching products
  fetchProducts();

  // Clean up the listener when the store is no longer used
  onUnmounted(() => {
    if (unsubscribe.value) {
      unsubscribe.value();
    }
  });

  return {
    products,
    addProduct,
    editProduct,
    deleteProduct,
  };
});
