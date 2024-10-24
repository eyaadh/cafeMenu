<template>
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
            <slot name="pageNavs" />
            <MenuItem v-if="route.path !== '/products'" v-slot="{ active }">
              <RouterLink
                to="/products"
                :class="[
                  active ? 'bg-gray-100/80 text-gray-900' : 'text-white',
                  'flex w-full items-center justify-start gap-2 px-4 py-2 text-sm',
                ]"
              >
                <ShoppingCartIcon class="mb-1 h-4 w-4" aria-hidden="true" />
                <span class="drop-shadow">Products Management</span>
              </RouterLink>
            </MenuItem>

            <MenuItem
              v-if="route.path !== '/reviewManagement'"
              v-slot="{ active }"
            >
              <RouterLink
                to="/reviewManagement"
                :class="[
                  active ? 'bg-gray-100/80 text-gray-900' : 'text-white',
                  'flex w-full items-center justify-start gap-2 px-4 py-2 text-sm',
                ]"
              >
                <ChatBubbleBottomCenterTextIcon
                  class="mb-1 h-4 w-4"
                  aria-hidden="true"
                />
                <span class="drop-shadow">Review Management</span>
              </RouterLink>
            </MenuItem>

            <MenuItem
              v-if="route.path !== '/ordersManagement'"
              v-slot="{ active }"
            >
              <RouterLink
                to="/ordersManagement"
                :class="[
                  active ? 'bg-gray-100/80 text-gray-900' : 'text-white',
                  'flex w-full items-center justify-start gap-2 px-4 py-2 text-sm',
                ]"
              >
                <ShoppingBagIcon class="mb-1 h-4 w-4" aria-hidden="true" />
                <span class="drop-shadow">Orders Management</span>
              </RouterLink>
            </MenuItem>

            <MenuItem v-slot="{ active }">
              <RouterLink
                to="/"
                :class="[
                  active ? 'bg-gray-100/80 text-gray-900' : 'text-white',
                  'flex w-full items-center justify-start gap-2 border-b border-white/10 px-4 py-2 text-sm',
                ]"
              >
                <HomeIcon class="mb-1 h-4 w-4" aria-hidden="true" />
                <span class="drop-shadow">Customer View</span>
              </RouterLink>
            </MenuItem>

            <MenuItem v-slot="{ active }">
              <RouterLink
                to="/qr"
                type="button"
                :class="[
                  active ? 'bg-gray-100/80 text-gray-900' : 'text-white',
                  'flex w-full items-center justify-start gap-2 border-b border-white/10 px-4 py-2 text-sm',
                ]"
              >
                <QrCodeIcon class="mb-1 h-4 w-4" aria-hidden="true" />
                <span class="drop-shadow">Show my QR</span>
              </RouterLink>
            </MenuItem>

            <MenuItem v-slot="{ active }">
              <button
                type="button"
                @click="signOutUser"
                :class="[
                  active ? 'bg-gray-100/80 text-gray-900' : 'text-white',
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
</template>

<script setup lang="ts">
import {
  ArrowLeftStartOnRectangleIcon,
  ChatBubbleBottomCenterTextIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  QrCodeIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
} from "@heroicons/vue/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { useAuth } from "@/composables/useAuth";
import { useRoute } from "vue-router";
const { signOutUser } = useAuth();

const route = useRoute();
</script>

<style scoped></style>
