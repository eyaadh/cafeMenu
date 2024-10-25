<template>
  <div
    class="flex h-screen w-full animate-fade-up items-center justify-center bg-gray-900 text-white animate-duration-[900ms]"
  >
    <div class="flex h-full w-full flex-col px-4 sm:max-w-3xl xl:px-0">
      <div class="border-b border-white/20 py-5">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h1 id="message-heading" class="text-base font-semibold leading-6">
              Orders Management
            </h1>
            <p class="mt-1 truncate text-sm text-gray-500">
              Update and manage your orders accordingly
            </p>
          </div>
          <ThemeNavMenu />
        </div>
      </div>

      <!-- main content -->
      <div class="h-full w-full overflow-auto [&::-webkit-scrollbar]:hidden">
        <div class="mt-8 flow-root">
          <div class="inline-block min-w-full py-2 align-middle text-white">
            <table class="w-full">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-3"
                  >
                    Contact Number
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Address
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Status
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody
                v-auto-animate
                class="animate-fade-in animate-duration-300"
              >
                <template v-for="order in ordersStore.orders" :key="order.id">
                  <tr class="border-t border-gray-200">
                    <th
                      scope="colgroup"
                      class="bg-white/10 py-2 pl-4 pr-3 text-left text-sm font-semibold text-white/80 sm:pl-3"
                    >
                      {{ order.contactNumber }}
                    </th>
                    <th
                      scope="colgroup"
                      class="bg-white/10 py-2 pl-4 pr-3 text-left text-sm font-semibold text-white/80 sm:pl-3"
                    >
                      {{ order.address }}
                    </th>
                    <th
                      scope="colgroup"
                      class="bg-white/10 py-2 pl-4 pr-3 text-left text-sm font-semibold text-white/80 sm:pl-3"
                    >
                      MRF {{ order.total?.toFixed(2) }}
                    </th>
                    <th
                      scope="colgroup"
                      class="bg-white/10 py-2 pl-4 pr-3 text-left text-sm font-semibold capitalize text-white/80 sm:pl-3"
                    >
                      {{ order.status }}
                    </th>
                    <th
                      colspan="2"
                      scope="colgroup"
                      class="cursor-pointer bg-white/10 py-2 pl-4 pr-3 text-left text-sm font-semibold normal-case text-white/80 hover:text-white sm:pl-3"
                      @click="openOrderManagementDialog(order)"
                    >
                      <PencilSquareIcon class="h-4 w-4 shrink-0" />
                    </th>
                  </tr>
                  <tr
                    v-for="(item, itemIdx) in order.items"
                    :key="item.item.id ? item.item.id : Date.now()"
                    :class="[
                      itemIdx === 0 ? 'border-gray-300' : 'border-gray-200',
                      'border-t',
                    ]"
                  >
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3"
                    >
                      {{ item.item.name }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      Price: MRF {{ item.item.price?.toFixed(2) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      Order Quantity: {{ item.qty }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      Total: MRF {{ item.total?.toFixed(2) }}
                    </td>
                  </tr>
                  <tr class="border-t border-gray-200">
                    <th
                      colspan="5"
                      scope="colgroup"
                      class="bg-white/5 py-2 pl-4 pr-3 text-left text-xs leading-4 tracking-wide text-white/80 sm:pl-3"
                    >
                      <div class="flex gap-2">
                        <ChatBubbleBottomCenterTextIcon
                          class="h-4 w-4 shrink-0"
                        />
                        <p class="whitespace-pre-line font-light">
                          {{ order.comment }}
                        </p>
                      </div>
                    </th>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ThemeDialog
    @dialog-close="closeOrderManagementDialog"
    title="Order management"
    ref="orderManagementDialog"
  >
    <template #body>
      <div class="text-left">
        <ul class="divide-y divide-gray-200" role="list">
          <li
            v-for="item in selectedOrder ? selectedOrder.items : []"
            :key="item.item.id ? item.item.id : Date.now()"
            class="flex px-4 py-6 sm:px-6"
          >
            <div class="flex-shrink-0">
              <img
                :src="populateImg(item)"
                alt="item image"
                class="w-20 rounded-md"
              />
            </div>

            <div class="ml-6 flex flex-1 flex-col">
              <div class="flex">
                <div class="min-w-0 flex-1">
                  <h4 class="text-sm font-medium text-gray-700">
                    {{ item.item.name }}
                  </h4>
                  <p class="mt-1 text-sm text-gray-500">
                    Price: MRF {{ item.item.price?.toFixed(2) }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    Total: MRF {{ item.total?.toFixed(2) }}
                  </p>
                </div>
                <div class="ml-4 flex flex-col items-end justify-between">
                  <div>
                    <div class="relative rounded-md shadow-sm">
                      <button
                        class="absolute left-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 ring-1 ring-inset ring-gray-300 sm:text-sm"
                        @click="stepDownQty(item)"
                      >
                        <MinusIcon class="h-4 w-4 shrink-0" />
                      </button>
                      <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        :disabled="true"
                        v-model="item.qty"
                        class="block w-28 rounded-md border-0 bg-white/5 py-1.5 pb-1 pl-10 pr-10 text-center text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-white/40 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        placeholder="10"
                        aria-describedby="price-currency"
                      />
                      <button
                        class="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 ring-1 ring-inset ring-gray-300 sm:text-sm"
                        @click="stepUpQty(item)"
                      >
                        <PlusIcon class="h-4 w-4 shrink-0" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="-m-2.5 flex items-center justify-center bg-white p-2.5 text-sm text-gray-400 hover:text-gray-500"
                    @click="removeItemFromOrder(item)"
                  >
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <dl class="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
          <div class="flex items-center justify-between">
            <dt class="text-sm">Address</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{ selectedOrder?.address }}
            </dd>
          </div>
          <div class="flex items-center justify-between">
            <dt class="text-sm">Contact Number</dt>
            <dd class="text-sm font-medium text-gray-900">
              {{ selectedOrder?.contactNumber }}
            </dd>
          </div>
          <div class="flex items-center justify-between">
            <dt class="text-sm">Order Status</dt>
            <dd class="text-sm font-medium text-gray-900">
              <div v-if="selectedOrder">
                <Listbox v-model="selectedOrder.status" as="div">
                  <div class="relative">
                    <ListboxButton
                      class="relative w-32 cursor-default rounded-md border border-gray-300 py-0.5 pl-3 pr-8 text-left text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    >
                      <span class="mt-1 block truncate capitalize">
                        {{ selectedOrder.status }}
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
                          value="completed"
                          v-slot="{ active, selected }"
                        >
                          <li
                            :class="[
                              active
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-900',
                              'relative cursor-default select-none py-2 pl-3 pr-9',
                            ]"
                          >
                            <span
                              :class="[
                                selected ? 'font-semibold' : 'font-normal',
                                'block truncate',
                              ]"
                            >
                              Completed
                            </span>
                          </li>
                        </ListboxOption>
                        <ListboxOption
                          value="pending"
                          v-slot="{ active, selected }"
                        >
                          <li
                            :class="[
                              active
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-900',
                              'relative cursor-default select-none py-2 pl-3 pr-9',
                            ]"
                          >
                            <span
                              :class="[
                                selected ? 'font-semibold' : 'font-normal',
                                'block truncate',
                              ]"
                            >
                              Pending
                            </span>
                          </li>
                        </ListboxOption>
                        <ListboxOption
                          value="processing"
                          v-slot="{ active, selected }"
                        >
                          <li
                            :class="[
                              active
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-900',
                              'relative cursor-default select-none py-2 pl-3 pr-9',
                            ]"
                          >
                            <span
                              :class="[
                                selected ? 'font-semibold' : 'font-normal',
                                'block truncate',
                              ]"
                            >
                              Processing
                            </span>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
              </div>
            </dd>
          </div>
          <div class="flex flex-col gap-2">
            <dt class="text-sm">Comments</dt>
            <dd class="whitespace-pre-line text-xs text-gray-900">
              {{ selectedOrder?.comment }}
            </dd>
          </div>
          <div
            class="flex items-center justify-between border-t border-gray-200 pt-6"
          >
            <dt class="text-base font-medium">Order Total</dt>
            <dd class="text-base font-medium text-gray-900">
              MRF {{ selectedOrder?.total?.toFixed(2) }}
            </dd>
          </div>
        </dl>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
        @click="saveOrder()"
      >
        Save
      </button>
      <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:mt-0"
        @click="deleteOrder()"
      >
        Delete
      </button>
      <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-span-2 sm:col-start-1 sm:mt-0"
        @click="closeOrderManagementDialog()"
      >
        Cancel
      </button>
    </template>
  </ThemeDialog>
</template>

<script setup lang="ts">
import ThemeNavMenu from "@/components/ThemeNavMenu.vue";
import { useOrdersStore } from "@/stores/useOrdersStore";
import {
  ChatBubbleBottomCenterTextIcon,
  ChevronUpDownIcon,
  MinusIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/vue/20/solid";
import { computed, onMounted, ref, watch } from "vue";
import type { IOrder, IOrderItem } from "@/types/Orders";
import ThemeDialog from "@/components/ThemeDialog.vue";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { minValue, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { sendOrderMessage } from "@/utils/telegram";
import { useRoute } from "vue-router";

const ordersStore = useOrdersStore();
const selectedOrder = ref<IOrder | null>(null);
const orderManagementDialog = ref<typeof ThemeDialog | null>(null);
const route = useRoute();

function openOrderManagementDialog(order: IOrder) {
  selectedOrder.value = order;
  orderManagementDialog.value?.openDialog();
}

function populateImg(item: IOrderItem) {
  if (item.item.image) {
    return item.item.image;
  }
  return "";
}

function closeOrderManagementDialog() {
  selectedOrder.value = null;
}

function stepDownQty(item: IOrderItem) {
  const itemIdx = selectedOrder.value?.items.findIndex(
    (i) => i.item.id === item.item.id,
  );

  if (itemIdx !== undefined && itemIdx !== -1 && selectedOrder.value) {
    const currentQty = selectedOrder.value.items[itemIdx].qty ?? 1; // default to 1 if null
    if (currentQty > 1) {
      selectedOrder.value.items[itemIdx].qty = currentQty - 1;
    }
  }
}

function stepUpQty(item: IOrderItem) {
  const itemIdx = selectedOrder.value?.items.findIndex(
    (i) => i.item.id === item.item.id,
  );

  if (itemIdx !== undefined && itemIdx !== -1 && selectedOrder.value) {
    const currentQty = selectedOrder.value.items[itemIdx].qty ?? 1; // default to 1 if null
    const limitPerOrder = item.item.limitPerOrder ?? Infinity; // no limit if undefined

    if (currentQty < limitPerOrder) {
      selectedOrder.value.items[itemIdx].qty = currentQty + 1;
    }
  }
}

function removeItemFromOrder(item: IOrderItem) {
  if (selectedOrder.value) {
    const itemIdx = selectedOrder.value.items.findIndex(
      (i) => i.item.id === item.item.id,
    );
    if (itemIdx !== -1) {
      selectedOrder.value?.items.splice(itemIdx, 1);
    }
  }
}

const isValidPhoneNumber = (value: string) => {
  const phoneRegex = /^\+?[0-9]{7,20}$/;
  return phoneRegex.test(value);
};

const orderValidationRules = {
  selectedOrder: {
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

const orderValidation = useVuelidate(orderValidationRules, { selectedOrder });

async function saveOrder() {
  await orderValidation.value.$validate();
  if (
    !orderValidation.value.$invalid &&
    selectedOrder.value &&
    selectedOrder.value.id
  ) {
    // 1. update the DB
    await ordersStore.editOrder(selectedOrder.value.id, selectedOrder.value);
    // 2. notify in TG Group
    await sendOrderMessage(selectedOrder.value, false);
    // 3. close the Dialog
    orderManagementDialog.value?.closeDialog();
  }
}

async function deleteOrder() {
  if (selectedOrder.value && selectedOrder.value.id) {
    await ordersStore.deleteOrder(selectedOrder.value.id);
    orderManagementDialog.value?.closeDialog();
  }
}

// Watch for changes in `qty` for each order item and update the item's total
watch(
  () => selectedOrder.value?.items.map((item: IOrderItem) => item.qty), // Use optional chaining
  () => {
    if (selectedOrder.value?.items) {
      selectedOrder.value.items.forEach((orderItem: IOrderItem) => {
        if (orderItem.qty !== null && orderItem.item.price !== null) {
          // Update the total for the individual order item
          orderItem.total = orderItem.qty * orderItem.item.price;
        } else {
          orderItem.total = null;
        }
      });
    }
  },
  { deep: true },
);

// Computed property to automatically calculate the total for the entire order
const orderTotal = computed(() => {
  return selectedOrder.value?.items.reduce((sum: number, item: IOrderItem) => {
    return sum + (item.total ?? 0);
  }, 0);
});

// Watch for the computed order total and update the `order.total`
watch(orderTotal, (newTotal) => {
  if (selectedOrder.value) {
    selectedOrder.value.total = newTotal as number;
  }
});

onMounted(() => {
  if (route.query.hasOwnProperty("order")) {
    const orderId = route.query.order;

    const unwatch = watch(
      () => ordersStore.orders,
      (orders) => {
        const orderDocIdx = orders.findIndex((o) => o.id === orderId);
        if (orderDocIdx !== -1) {
          selectedOrder.value = orders[orderDocIdx];
          orderManagementDialog.value?.openDialog();
          unwatch(); // Stop watching once the dialog is triggered
        }
      },
      { immediate: true },
    );
  }
});
</script>

<style scoped></style>
