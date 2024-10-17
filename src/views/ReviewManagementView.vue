<template>
  <div
    class="animate-fade-up animate-duration-[900ms] flex h-screen w-full items-center justify-center bg-gray-900 text-white"
  >
    <div class="flex h-full w-full flex-col px-4 sm:max-w-3xl xl:px-0">
      <div class="border-b border-white/20 py-5">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h1 id="message-heading" class="text-base font-semibold leading-6">
              Review Management
            </h1>
            <p class="mt-1 truncate text-sm text-gray-500">
              Review and approve the feedback from the customers.
            </p>
          </div>

          <div class="flex items-center justify-between">
            <Menu as="div" class="relative ml-3 inline-block text-left">
              <div>
                <MenuButton
                  class="-my-2 flex items-center rounded-full bg-white/5 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">Open options</span>
                  <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                </MenuButton>
              </div>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-2 z-50 mt-4 w-56 origin-top-right rounded-md bg-gray-900/55 shadow-lg ring-2 ring-white/10 ring-opacity-5 backdrop-blur-sm focus:outline-none"
                >
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <RouterLink
                        to="/products"
                        :class="[
                          active
                            ? 'bg-gray-100/80 text-gray-900'
                            : 'text-white',
                          'flex w-full items-center justify-start gap-2 border-b border-white/10 px-4 py-2 text-sm',
                        ]"
                      >
                        <ShoppingCartIcon
                          class="mb-1 h-4 w-4"
                          aria-hidden="true"
                        />
                        <span class="drop-shadow">Products Management</span>
                      </RouterLink>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <RouterLink
                        to="/"
                        :class="[
                          active
                            ? 'bg-gray-100/80 text-gray-900'
                            : 'text-white',
                          'flex w-full items-center justify-start gap-2 px-4 py-2 text-sm',
                        ]"
                      >
                        <HomeIcon class="mb-1 h-4 w-4" aria-hidden="true" />
                        <span class="drop-shadow">Customer View</span>
                      </RouterLink>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <button
                        type="button"
                        :class="[
                          active
                            ? 'bg-gray-100/80 text-gray-900'
                            : 'text-white',
                          'flex w-full items-center justify-start gap-2 border-b border-white/10 px-4 py-2 text-sm',
                        ]"
                      >
                        <QrCodeIcon class="mb-1 h-4 w-4" aria-hidden="true" />
                        <span class="drop-shadow">Show my QR</span>
                      </button>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <button
                        type="button"
                        @click="signOutUser"
                        :class="[
                          active
                            ? 'bg-gray-100/80 text-gray-900'
                            : 'text-white',
                          'flex w-full items-center justify-start gap-2 px-4 py-2 text-sm',
                        ]"
                      >
                        <ArrowLeftStartOnRectangleIcon
                          class="mb-1 h-4 w-4"
                          aria-hidden="true"
                        />
                        <span class="drop-shadow">Sign Out</span>
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <div class="h-full w-full overflow-auto [&::-webkit-scrollbar]:hidden">
        <ul role="list" class="divide-y divide-gray-100" v-auto-animate>
          <li v-for="review in reviewStore.reviews" class="py-5">
            <div>
              <div class="flex items-baseline justify-between gap-x-4">
                <p class="text-sm font-semibold leading-6 text-white/80">
                  {{ review.author }}
                </p>
                <p class="flex-none text-xs text-gray-600">
                  <time
                    :datetime="
                      review.datetime
                        ? review.datetime
                        : new Date().toISOString()
                    "
                    >{{ review.date }}</time
                  >
                </p>
              </div>
              <div class="mb-2 flex items-center">
                <div class="flex items-center">
                  <StarIcon
                    v-for="rating in [0, 1, 2, 3, 4]"
                    :key="rating"
                    :class="[
                      review.rating > rating
                        ? 'text-yellow-400'
                        : 'text-white/50',
                      'h-3 w-3 flex-shrink-0',
                    ]"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <PhoneIcon class="mb-1 h-3 w-3" />
                <a
                  :href="`tel:${review.phoneNumber}`"
                  class="text-sm font-medium leading-6 text-white/50"
                >
                  {{ review.phoneNumber }}
                </a>
              </div>
              <div class="flex items-center gap-2">
                <EnvelopeIcon class="mb-1 h-3 w-3" />
                <a
                  :href="`mailto:${review.email}`"
                  class="text-sm font-medium leading-6 text-white/50"
                >
                  {{ review.email }}
                </a>
              </div>
              <p
                class="mt-1 whitespace-pre-line text-sm leading-6 text-white/50"
              >
                {{ review.content }}
              </p>
            </div>
            <div class="flex items-center justify-end gap-2 px-px">
              <button
                class="inline-flex items-center gap-2 rounded-md px-3 pb-1 pt-2 text-xs shadow-sm ring-1 ring-white/5 hover:bg-white/10"
                v-if="review.status === 'pending'"
                @click="approveReview(review)"
              >
                Approve
              </button>
              <button
                class="inline-flex items-center gap-2 rounded-md px-3 pb-1 pt-2 text-xs shadow-sm ring-1 ring-white/5 hover:bg-white/10"
                v-if="review.status === 'approved'"
                @click="rejectReview(review)"
              >
                Reject
              </button>
              <button
                class="inline-flex items-center gap-2 rounded-md px-3 pb-1 pt-2 text-xs shadow-sm ring-1 ring-white/5 hover:bg-white/10"
                @click="removeReview(review)"
              >
                Remove
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftStartOnRectangleIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  QrCodeIcon,
  ShoppingCartIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
} from "@heroicons/vue/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { useAuth } from "@/composables/useAuth";
import { useReviewsStore } from "@/stores/useReviewsStore";
import type { IReview } from "@/types/Reviews";

const { signOutUser } = useAuth();
const reviewStore = useReviewsStore();

async function approveReview(review: IReview) {
  if (review.id) {
    review.status = "approved";
    await reviewStore.editReview(review.id, review);
  }
}

async function rejectReview(review: IReview) {
  if (review.id) {
    review.status = "pending";
    await reviewStore.editReview(review.id, review);
  }
}

async function removeReview(review: IReview) {
  if (review.id) {
    await reviewStore.deleteReview(review.id);
  }
}
</script>

<style scoped></style>
