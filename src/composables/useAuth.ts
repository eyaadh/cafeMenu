import { ref } from "vue";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useRouter } from "vue-router";

export function useAuth() {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const router = useRouter();

  // Listen to Firebase auth state changes
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    loading.value = false;
  });

  // Sign-out function with router redirection
  const signOutUser = async () => {
    try {
      await signOut(auth);
      user.value = null; // Clear the user after signing out
      await router.push("/"); // Redirect to home page after signing out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { user, loading, signOutUser };
}
