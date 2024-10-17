import { createRouter, createWebHistory } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/reviews",
      name: "reviews",
      component: () => import("../views/ReviewsView.vue"),
    },
    {
      path: "/products",
      name: "products",
      component: () => import("../views/ProductsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/reviewManagement",
      name: "ReviewManagement",
      component: () => import("../views/ReviewManagementView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// Get the current user from Firebase auth
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject,
    );
  });
};

// Global Route Guard
router.beforeEach(async (to, from, next) => {
  const currentUser = await getCurrentUser();

  if (to.meta.requiresAuth && !currentUser) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (to.name === "login" && currentUser) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
