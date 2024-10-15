<template>
  <div
    class="animate-fade-up animate-duration-[900ms] flex h-screen w-full items-center justify-center bg-gray-900"
  >
    <div class="w-full max-w-sm px-4 pb-10 pt-5 md:max-w-md">
      <div class="flex flex-col items-center">
        <BrandLogo class="h-40 text-gray-100" />
        <h2
          class="text-center text-2xl font-bold leading-9 tracking-tight text-white"
        >
          Sign in to your account
        </h2>
      </div>
      <p
        v-if="error"
        class="animate-fade-down animate-duration-700 mt-4 text-center font-mono text-sm tracking-wide text-pink-800"
      >
        {{ error }}
      </p>
      <form class="mt-10 space-y-6" @submit.prevent="login">
        <div class="mt-2">
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-white"
          >
            Email
          </label>
          <div
            class="mt-2 flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
          >
            <input
              type="email"
              name="email"
              id="email"
              v-model="email"
              autocomplete="email"
              class="flex-1 border-0 bg-transparent px-2 py-1.5 text-white outline-0 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="user@email.com"
            />
          </div>
        </div>
        <div class="mt-2">
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-white"
          >
            Password
          </label>
          <div
            class="mt-2 flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
          >
            <input
              type="password"
              name="password"
              id="password"
              v-model="password"
              autocomplete="password"
              class="flex-1 border-0 bg-transparent px-2 py-1.5 text-white outline-0 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder=""
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useRouter, useRoute } from "vue-router";
import BrandLogo from "@/components/BrandLogo.vue";

const email = ref("");
const password = ref("");
const error = ref(null);

const router = useRouter();
const route = useRoute();

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    // Redirect to the original destination or home
    const redirectPath = (route.query.redirect as string) || "/";
    await router.push(redirectPath);
  } catch (err: any) {
    error.value = err.message;
  }
};
</script>
