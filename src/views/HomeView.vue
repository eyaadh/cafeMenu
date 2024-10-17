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
        <div class="flex w-full justify-end px-2">
          <Listbox as="div" v-model="productsStore.categoryFilter">
            <ListboxLabel class="sr-only">Filter by category</ListboxLabel>
            <div
              v-show="productsStore.itemsByCategory().value.length > 0"
              class="relative"
            >
              <div
                class="animate-fade animate-duration-[900ms] animate-ease-linear animate-fill-both inline-flex divide-x divide-white/10 rounded-md shadow-sm"
              >
                <div
                  class="inline-flex items-center gap-x-1.5 rounded-l-md bg-white/5 px-3 py-1.5 text-white shadow-sm"
                >
                  <CheckIcon class="-ml-0.5 mb-1 h-3 w-3" aria-hidden="true" />
                  <p class="text-xs">
                    {{
                      productsStore.categoryFilter
                        ? productsStore.categoryFilter.name
                        : "All"
                    }}
                  </p>
                </div>
                <ListboxButton
                  class="inline-flex items-center rounded-l-none rounded-r-md bg-white/5 px-2 py-1.5 hover:bg-white/10 focus:outline-none focus:ring-0"
                >
                  <span class="sr-only">Filter by category</span>
                  <ChevronDownIcon
                    class="mb-1 h-3 w-3 text-white"
                    aria-hidden="true"
                  />
                </ListboxButton>
              </div>

              <transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions
                  class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-gray-900/55 shadow-lg ring-2 ring-white/10 ring-opacity-5 backdrop-blur-sm focus:outline-none"
                >
                  <ListboxOption
                    as="template"
                    v-for="category in categoriesFilterOptions"
                    :value="category"
                    v-slot="{ active, selected }"
                  >
                    <li
                      :class="[
                        active ? 'bg-gray-100/80 text-gray-900' : 'text-white',
                        'flex w-full items-center justify-start gap-2 border-b border-white/10 px-4 py-2 text-sm',
                      ]"
                    >
                      <div class="flex w-full flex-col">
                        <div class="flex w-full justify-between">
                          <p
                            :class="selected ? 'font-semibold' : 'font-normal'"
                          >
                            {{ category.name }}
                          </p>
                          <span
                            v-if="selected"
                            :class="active ? 'text-gray-900' : 'text-white'"
                          >
                            <CheckIcon
                              class="mb-1 h-3 w-3"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </div>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <ul
          class="mt-4 flex w-full gap-4 overflow-auto px-2 sm:grid sm:grid-cols-2 sm:gap-2 md:grid-cols-3 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          v-auto-animate="{ duration: 700 }"
        >
          <li
            v-for="product in productsStore.itemsByCategory().value"
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

      <ThemeFooter :comments-option="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BrandLogo from "@/components/BrandLogo.vue";
import { useProductsStore } from "@/stores/useProductsStore";
import { CheckIcon, ChevronDownIcon } from "@heroicons/vue/20/solid";
import IconMVRF from "@/components/icons/IconMVRF.vue";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { computed } from "vue";
import ThemeFooter from "@/components/ThemeFooter.vue";

const productsStore = useProductsStore();
const categoryStore = useCategoriesStore();

const categoriesFilterOptions = computed(() => {
  return [{ id: null, name: "All" }, ...categoryStore.categories];
});
</script>
