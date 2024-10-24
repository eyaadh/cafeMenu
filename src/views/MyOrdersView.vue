<template>
  <div class="h-screen w-full text-white">
    <div
      class="mx-auto flex h-full w-full max-w-3xl animate-fade-up flex-col items-center animate-duration-[900ms] animate-fill-both animate-ease-linear"
    >
      <!--logo -->
      <div>
        <BrandLogo class="w-36 text-gray-100" />
      </div>

      <div
        class="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"
      >
        <div class="flex w-full justify-between">
          <h2 class="text-lg font-medium">My Shopping Bag</h2>

          <div class="flex gap-2">
            <RouterLink
              to="/"
              class="inline-flex items-center rounded-md bg-white/5 px-2 py-1.5 hover:bg-white/10 focus:outline-none focus:ring-0"
            >
              <HomeIcon class="mb-1 h-3 w-3 text-white" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>

        <div class="mt-12">
          <div>
            <h2 class="sr-only">Items in your shopping bag</h2>

            <ul
              role="list"
              class="divide-y divide-white/10 border-b border-t border-white/10"
            >
              <li
                v-for="item in myOrder.items"
                :key="item.item.id"
                class="flex py-6 sm:py-10"
              >
                <div class="flex-shrink-0">
                  <img
                    :src="item.item.image"
                    :alt="item.item.name"
                    class="h-24 w-24 rounded-lg object-cover object-center sm:h-32 sm:w-32"
                  />
                </div>

                <div
                  class="relative ml-4 flex w-full flex-1 flex-col justify-between sm:ml-6"
                >
                  <div class="flex flex-col gap-4">
                    <div class="flex w-full justify-between">
                      <div class="pr-6">
                        <h3 class="text-sm font-medium text-white">
                          {{ item.item.name }}
                        </h3>

                        <div class="flex items-center gap-2">
                          <div
                            class="mb-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/50 text-gray-900"
                          >
                            <IconMVRF class="h-1.5" />
                          </div>
                          <p class="text-xs text-white/50">
                            Price: {{ item.item.price.toFixed(2) }}
                          </p>
                        </div>
                      </div>

                      <div class="flex items-start gap-2 sm:items-center">
                        <div
                          class="mb-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-gray-900"
                        >
                          <IconMVRF class="h-1.5" />
                        </div>
                        <p class="text-xs">
                          Total: {{ item.total.toFixed(2) }}
                        </p>
                      </div>
                    </div>

                    <div
                      class="flex items-center sm:absolute sm:left-1/2 sm:top-0 sm:mt-0 sm:block"
                    >
                      <Listbox v-model="item.qty" as="div">
                        <div class="relative">
                          <ListboxButton
                            :class="[item.qty ? 'w-16' : 'w-full']"
                            class="relative cursor-default rounded-md border-0 bg-white bg-white/5 py-0.5 pl-3 pr-8 text-left text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/10"
                          >
                            <span class="mt-1 block truncate">
                              {{ item.qty || "Select Quantity" }}
                            </span>
                            <span
                              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                            >
                              <ChevronUpDownIcon
                                class="mb-1 h-4 w-4 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </ListboxButton>

                          <transition
                            leave-active-class="transition ease-in duration-100"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                          >
                            <ListboxOptions
                              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/50 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-sm focus:outline-none [&::-webkit-scrollbar]:hidden"
                            >
                              <ListboxOption
                                v-for="qty in calculateQty(item.item)"
                                :key="qty"
                                :value="qty"
                                v-slot="{ active, selected }"
                              >
                                <li
                                  :class="[
                                    active
                                      ? 'bg-white/50 text-gray-900'
                                      : 'text-gray-900',
                                    'relative cursor-default select-none py-2 pl-3 pr-9',
                                  ]"
                                >
                                  <span
                                    :class="[
                                      selected
                                        ? 'font-semibold'
                                        : 'font-normal',
                                      'block truncate',
                                    ]"
                                  >
                                    {{ qty }}
                                  </span>
                                </li>
                              </ListboxOption>
                            </ListboxOptions>
                          </transition>
                        </div>
                      </Listbox>

                      <button
                        type="button"
                        class="ml-4 text-sm font-medium text-white/50 hover:text-white/80 sm:ml-0"
                        @click="removeItemFromOrder(item)"
                      >
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Order summary -->
          <div class="mt-10 w-full">
            <div class="rounded-lg bg-white/10 px-4 py-6">
              <h2 class="sr-only">Order summary</h2>

              <div class="flow-root">
                <dl class="divide-y divide-white/10 text-sm">
                  <div class="grid gap-2 sm:grid-cols-2">
                    <div class="mb-2">
                      <label
                        for="contactNumber"
                        class="block text-base font-medium leading-6 text-white/80"
                      >
                        Contact Number
                      </label>
                      <div class="mt-2">
                        <input
                          type="tel"
                          name="contactNumber"
                          id="contactNumber"
                          :class="
                            orderValidation.myOrder.contactNumber.$error
                              ? 'ring-red-300'
                              : 'ring-white/10'
                          "
                          class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-sm text-white shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-white/10"
                          placeholder="+9609912345"
                          autocomplete="tel"
                          v-model="(myOrder as IOrder).contactNumber"
                        />
                      </div>
                    </div>
                    <div class="mb-2">
                      <label
                        for="address"
                        class="block text-base font-medium leading-6 text-white/80"
                      >
                        Address
                      </label>
                      <div class="mt-2">
                        <input
                          type="text"
                          name="address"
                          id="address"
                          autocomplete="address"
                          :class="
                            orderValidation.myOrder.address.$error
                              ? 'ring-red-300'
                              : 'ring-white/10'
                          "
                          class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-sm text-white shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-white/10"
                          placeholder="Home Name/Road"
                          v-model="(myOrder as IOrder).address"
                        />
                      </div>
                    </div>
                    <div class="col-span-full mb-2">
                      <label
                        for="comment"
                        class="block text-base font-medium leading-6 text-white/80"
                      >
                        Comments
                      </label>
                      <div class="mt-2">
                        <textarea
                          rows="3"
                          name="comment"
                          id="comment"
                          v-model="(myOrder as IOrder).comment"
                          class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-sm text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/10"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex flex-row-reverse items-center justify-between py-4"
                  >
                    <dd class="flex gap-2 text-white/80">
                      <div
                        class="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-gray-900"
                      >
                        <IconMVRF class="h-1.5" />
                      </div>
                      <p class="text-sm font-medium">
                        {{ myOrder.total.toFixed(2) }}
                      </p>
                    </dd>
                    <dt class="text-base font-medium text-white/80">
                      Order total
                    </dt>
                  </div>
                </dl>
              </div>
            </div>
            <div class="mt-10">
              <button
                class="w-full rounded-md border border-transparent bg-white/5 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/10"
                @click="checkoutOrder"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <ThemeFooter :comments-option="true" />
    </div>
  </div>

  <ThemeDialog
    @dialog-close="router.push('/')"
    ref="orderConfirmationDialog"
    title="Order Received"
  >
    <template #body>
      <div class="flex items-start">
        <div class="flex w-0 flex-1 flex-col items-center pt-0.5">
          <div><CheckCircleIcon class="h-14 w-14 text-green-500" /></div>
          <p class="mt-4 text-sm text-gray-500">
            We have notified the cafe, and their team will call you to finalize
            the order. This message <strong>does not confirm</strong> your
            order. If you have any questions or concerns about the order, feel
            free to
            <a href="tel:+9607940979" class="font-semibold underline"
              >contact us</a
            >
            to address any delays in the confirmation process.
          </p>
        </div>
      </div>
    </template>
  </ThemeDialog>
</template>

<script setup lang="ts">
import BrandLogo from "@/components/BrandLogo.vue";
import { useOrdersStore } from "@/stores/useOrdersStore";
import IconMVRF from "@/components/icons/IconMVRF.vue";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import {
  ChevronUpDownIcon,
  HomeIcon,
  CheckCircleIcon,
} from "@heroicons/vue/20/solid";
import type { IProduct } from "@/types/Products";
import { computed, ref, watch } from "vue";
import type { IOrder, IOrderItem } from "@/types/Orders";
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import ThemeFooter from "@/components/ThemeFooter.vue";
import ThemeDialog from "@/components/ThemeDialog.vue";
import { useRouter } from "vue-router";
import { sendOrderMessage } from "@/utils/telegram";

const ordersStore = useOrdersStore();
const { myOrder } = ordersStore;
const orderConfirmationDialog = ref<typeof ThemeDialog | null>(null);
const router = useRouter();

function calculateQty(product: IProduct) {
  if (!product.limitPerOrder) return [];
  return Array.from({ length: product.limitPerOrder }, (_, i) => i + 1);
}

function removeItemFromOrder(item: IOrderItem) {
  const itemIdx = (myOrder as IOrder).items.findIndex(
    (i) => i.item.id === item.item.id,
  );
  if (itemIdx !== -1) {
    myOrder.items.splice(itemIdx, 1);
  }
}

// Watch for changes in `qty` for each order item and update the item's total
watch(
  () => myOrder.items.map((item: IOrderItem) => item.qty),
  (_) => {
    myOrder.items.forEach((orderItem: IOrderItem) => {
      if (orderItem.qty !== null && orderItem.item.price !== null) {
        // Update the total for the individual order item
        orderItem.total = orderItem.qty * orderItem.item.price;
      } else {
        orderItem.total = null;
      }
    });
  },
  { deep: true },
);

// Computed property to automatically calculate the total for the entire order
const orderTotal = computed(() => {
  return myOrder.items.reduce((sum: number, item: IOrderItem) => {
    return sum + (item.total ?? 0);
  }, 0);
});

// Watch for the computed order total and update the `order.total`
watch(orderTotal, (newTotal) => {
  ordersStore.myOrder.total = newTotal;
});

const isValidPhoneNumber = (value: string) => {
  const phoneRegex = /^\+?[0-9]{7,20}$/;
  return phoneRegex.test(value);
};

const orderValidationRules = {
  myOrder: {
    items: {
      $each: {
        qty: { required, minValue: minValue(1) }, // Quantity must be at least 1
        total: { required }, // Total must be provided
      },
    },
    contactNumber: { required, contactNumber: isValidPhoneNumber }, // Ensure contact number is provided
    address: { required }, // Ensure address is provided
  },
};

const orderValidation = useVuelidate(orderValidationRules, { myOrder });

async function checkoutOrder() {
  await orderValidation.value.$validate();
  if (!orderValidation.value.$invalid) {
    // 1. save the order to DB
    await ordersStore.addOrder(myOrder);
    // 2. notify in tg group
    await sendOrderMessage(ordersStore.myOrder);
    // 3. show feedback to the user
    orderConfirmationDialog.value?.openDialog();
    // 4. clear my order
    ordersStore.myOrder = null;
    // 5. after 4 secs close the dialog
    setTimeout(() => {
      orderConfirmationDialog.value?.closeDialog();
    }, 4000);
  }
}
</script>

<style scoped></style>
