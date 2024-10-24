import { defineStore } from "pinia";
import { StorageSerializers, useStorage } from "@vueuse/core";
import type { IOrder } from "@/types/Orders";
import { onUnmounted, ref } from "vue";
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
import { useAuth } from "@/composables/useAuth";
import { sendOrderMessage } from "@/utils/telegram";

export const useOrdersStore = defineStore("orders", () => {
  const myOrder = useStorage("myOrder", null as IOrder | null, localStorage, {
    serializer: StorageSerializers.object,
  });
  const { user } = useAuth();
  const orders = ref<IOrder[]>([]);
  const unsubscribe = ref<Unsubscribe | null>(null);

  // Fetch documents and listen for real-time updates
  const fetchOrders = () => {
    const colRef = collection(db, "orders");
    unsubscribe.value = onSnapshot(
      colRef,
      (snapshot) => {
        orders.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as IOrder[];
      },
      (error) => {
        console.error("Error fetching documents:", error);
      },
    );
  };

  // Add a new order
  const addOrder = async (newOrder: IOrder) => {
    try {
      const colRef = collection(db, "orders");
      const docRef = await addDoc(colRef, newOrder);

      // update the document with the auto-generated ID
      await updateDoc(doc(db, "orders", docRef.id), { id: docRef.id });

      // finally update the doc restriction
      await updateDoc(doc(db, "orders", docRef.id), { restricted: true });

      newOrder.id = docRef.id;

      await sendOrderMessage(newOrder);

      console.log(`Order added successfully with ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  // update an order
  const editOrder = async (docId: string, newData: Partial<IOrder>) => {
    try {
      const docRef = doc(db, "orders", docId);
      await updateDoc(docRef, newData);
      console.log("Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Delete an order
  const deleteOrder = async (docId: string) => {
    try {
      const docRef = doc(db, "orders", docId);
      await deleteDoc(docRef);
      console.log("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting orders:", error);
    }
  };

  // Initialize the store by fetching products
  if (user) {
    fetchOrders();
  }

  // Clean up the listener when the store is no longer used
  onUnmounted(() => {
    if (unsubscribe.value) {
      unsubscribe.value();
    }
  });

  return {
    myOrder,
    orders,
    fetchOrders,
    addOrder,
    editOrder,
    deleteOrder,
  };
});
