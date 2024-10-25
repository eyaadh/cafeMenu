<template>
  <div class="h-screen w-full text-white">
    <div
      class="mx-auto flex h-full w-full max-w-3xl animate-fade-up flex-col items-center justify-center animate-duration-[900ms] animate-fill-both animate-ease-linear"
    >
      <!--logo -->
      <div>
        <BrandLogo class="w-36 text-gray-100" />
      </div>

      <div
        class="mt-10 w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_55px,_black_calc(100%-55px),transparent_100%)] sm:overflow-auto sm:[mask-image:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          v-show="productsStore.itemsByCategory().value.length > 0"
          class="flex w-full justify-end gap-2 px-2"
        >
          <RouterLink
            to="/myOrders"
            v-if="orderStore.myOrder"
            class="inline-flex items-center rounded-md bg-white/5 px-2 py-1.5 hover:bg-white/10 focus:outline-none focus:ring-0"
          >
            <span class="sr-only">Filter by category</span>
            <ShoppingBagIcon
              class="mb-1 h-3 w-3 text-white"
              aria-hidden="true"
            />
          </RouterLink>
          <Listbox as="div" v-model="productsStore.categoryFilter">
            <ListboxLabel class="sr-only">Filter by category</ListboxLabel>
            <div class="relative">
              <div
                class="inline-flex animate-fade divide-x divide-white/10 rounded-md shadow-sm animate-duration-[900ms] animate-fill-both animate-ease-linear"
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
            @click="openOrderItemSelectionDialog(product)"
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
  <ThemeDialog
    @dialog-close="closeOrderItemSelectionDialog"
    :title="
      selectedItemForm.itemSelected
        ? (selectedItemForm.itemSelected.name as unknown as string)
        : ''
    "
    ref="orderItemSelectionDialog"
  >
    <template #body>
      <div class="aspect-1 w-full">
        <img
          alt="productImg"
          :src="
            selectedItemForm.itemSelected
              ? (selectedItemForm.itemSelected.image as unknown as string)
              : ''
          "
          class="w-full rounded-md object-cover"
        />
      </div>
      <div class="mt-4 flex items-center justify-between border-b">
        <div class="flex items-center gap-2">
          <div
            class="mb-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-white"
          >
            <IconMVRF class="h-2" />
          </div>
          <p class="text-sm font-semibold">
            Price:
            {{
              selectedItemForm.itemSelected
                ? (selectedItemForm.itemSelected.price as unknown as string)
                : ""
            }}
          </p>
        </div>
        <div class="mb-2 flex items-center gap-2">
          <div class="flex items-end gap-2">
            <div class="relative mt-2 rounded-md shadow-sm">
              <button
                class="absolute left-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 ring-1 ring-inset ring-gray-300 sm:text-sm"
                @click="stepDownQty()"
              >
                <MinusIcon class="h-4 w-4 shrink-0" />
              </button>
              <input
                type="number"
                name="quantity"
                id="quantity"
                :disabled="true"
                v-model="selectedItemForm.selectedQty"
                class="block w-28 rounded-md border-0 py-1.5 pb-1 pl-10 pr-10 text-center text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                placeholder="10"
                aria-describedby="price-currency"
              />
              <button
                class="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 ring-1 ring-inset ring-gray-300 sm:text-sm"
                @click="stepUpQty()"
              >
                <PlusIcon class="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        @click="addToBag"
        type="button"
        class="col-span-full inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Add to bag
      </button>
    </template>
  </ThemeDialog>
</template>

<script setup lang="ts">
import BrandLogo from "@/components/BrandLogo.vue";
import { useProductsStore } from "@/stores/useProductsStore";
import {
  CheckIcon,
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
} from "@heroicons/vue/20/solid";
import IconMVRF from "@/components/icons/IconMVRF.vue";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { computed, ref } from "vue";
import ThemeFooter from "@/components/ThemeFooter.vue";
import ThemeDialog from "@/components/ThemeDialog.vue";
import type { IProduct } from "@/types/Products";
import { required, numeric } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useOrdersStore } from "@/stores/useOrdersStore";
import type { IOrderItem } from "@/types/Orders";

const productsStore = useProductsStore();
const categoryStore = useCategoriesStore();
const orderItemSelectionDialog = ref<typeof ThemeDialog | null>(null);
const orderStore = useOrdersStore();

interface ISelectedItemForm {
  itemSelected: IProduct | null;
  selectedQty: number | null;
}

const selectedItemForm = ref<ISelectedItemForm>({
  itemSelected: null,
  selectedQty: 1,
});

const selectedItemFormValidationRules = computed(() => {
  return {
    itemSelected: { required },
    selectedQty: { required, numeric },
  };
});

const selectedItemFormValidation = useVuelidate(
  selectedItemFormValidationRules,
  selectedItemForm,
);

async function addToBag() {
  await selectedItemFormValidation.value.$validate();
  if (!selectedItemFormValidation.value.$invalid) {
    const itemSelected = selectedItemForm.value.itemSelected;
    const selectedQty = selectedItemForm.value.selectedQty;

    if (itemSelected && selectedQty !== null) {
      const orderItem: IOrderItem = {
        item: itemSelected,
        qty: selectedQty,
        total: itemSelected.price ? itemSelected.price * selectedQty : null,
      };

      // Check if there is an existing order in myOrder, if not, create a new order
      if (!orderStore.myOrder) {
        orderStore.myOrder = {
          items: [],
          total: 0,
          comment: null,
          contactNumber: null,
          address: null,
          status: "pending",
          restricted: false,
        };
      }

      // Add the new item to the order's items array
      orderStore.myOrder.items.push(orderItem);

      // Update the total for the order
      orderStore.myOrder.total = orderStore.myOrder.items.reduce(
        (acc: number, item: IOrderItem) => {
          const itemTotal = item.total ?? 0; // Ensure item.total is a number, defaulting to 0
          return acc + itemTotal;
        },
        0,
      );

      // finally close the dialog
      orderItemSelectionDialog.value?.closeDialog();
    }
  }
}

function openOrderItemSelectionDialog(product: IProduct) {
  selectedItemForm.value.itemSelected = product;
  orderItemSelectionDialog.value?.openDialog();
}

function closeOrderItemSelectionDialog() {
  selectedItemForm.value.selectedQty = 1;
  selectedItemForm.value.itemSelected = null;

  selectedItemFormValidation.value.$reset();
}

const categoriesFilterOptions = computed(() => {
  return [{ id: null, name: "All" }, ...categoryStore.categories];
});

function stepDownQty() {
  if (
    selectedItemForm.value.selectedQty !== 1 &&
    selectedItemForm.value.selectedQty
  ) {
    selectedItemForm.value.selectedQty -= 1;
  }
}

function stepUpQty() {
  if (
    selectedItemForm.value.selectedQty !==
      selectedItemForm.value.itemSelected?.limitPerOrder &&
    selectedItemForm.value.selectedQty
  ) {
    selectedItemForm.value.selectedQty += 1;
  }
}
</script>
