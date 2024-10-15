<template>
  <div class="h-screen w-full text-white">
    <div
      class="animate-fade-up animate-duration-[900ms] animate-ease-linear animate-fill-both mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center"
    >
      <!--logo -->
      <div>
        <BrandLogo class="w-36 text-gray-100" />
      </div>

      <div
        class="mt-10 w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_55px,_black_calc(100%-55px),transparent_100%)] sm:overflow-auto sm:[mask-image:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul
          class="flex w-full gap-4 overflow-auto px-2 sm:grid sm:grid-cols-2 sm:gap-2 md:grid-cols-3 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          v-auto-animate
        >
          <li
            v-for="product in productsStore.products"
            :key="product.id ? product.id : new Date().getTime()"
            class="group relative w-36 flex-shrink-0 overflow-hidden rounded-md border border-white/10 py-4 shadow-md sm:w-auto sm:py-6"
          >
            <div
              class="aspect-h-1 aspect-w-1 -mt-4 overflow-hidden bg-gray-200 group-hover:opacity-75 sm:-mt-6"
            >
              <img
                :src="product.image ? product.image : ''"
                :alt="product.name ? product.name : ''"
                class="h-44 w-full object-cover object-center"
              />
            </div>
            <div class="px-4 pt-4">
              <div class="-mx-4 -mt-4 bg-white/10 px-4 pb-2 pt-4">
                <h3 class="line-clamp-2 h-10 text-sm font-medium">
                  {{ product.name }}
                </h3>
              </div>
              <div class="mt-4 flex items-center gap-2">
                <div
                  class="mb-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-gray-900"
                >
                  <IconMVRF class="h-1.5" />
                </div>
                <p class="text-xs">Price: {{ product.price }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div
        class="mt-20 flex w-full flex-col items-center justify-center gap-2 text-white/40"
      >
        <div class="flex items-center gap-4">
          <a class="hover:text-white/80" href="tel:+9607940979">
            <DevicePhoneMobileIcon class="mb-0.5 h-6" />
          </a>
          <a
            class="hover:text-white/80"
            href="https://maps.app.goo.gl/6okBsYqiZEkGUpHQA"
          >
            <MapIcon class="mb-0.5 h-6" />
          </a>
          <a
            class="hover:text-white/80"
            href="https://www.facebook.com/profile.php?id=100057313703827"
          >
            <IconFacebook class="mb-0.5 h-6" />
          </a>
          <a
            class="hover:text-white/80"
            href="https://invite.viber.com/?g2=AQBRG%2B0RR7iEwlObA5uowMwLproB0RQ%2Bv3AK87%2Bnbm2fZNZyFp168U9NukvDu2Ws"
          >
            <IconViber class="h-6" />
          </a>
        </div>
        <span class="text-xs leading-6 tracking-wider">
          Copyright © 2024 Cafe Breeze. All Rights Reserved.
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BrandLogo from "@/components/BrandLogo.vue";
import { useProductsStore } from "@/stores/useProductsStore";
import { MapIcon, DevicePhoneMobileIcon } from "@heroicons/vue/20/solid";
import IconViber from "@/components/icons/IconViber.vue";
import IconFacebook from "@/components/icons/IconFacebook.vue";
import IconMVRF from "@/components/icons/IconMVRF.vue";

const productsStore = useProductsStore();
</script>
