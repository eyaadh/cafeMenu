<template>
  <div
    class="mt-20 flex w-full flex-col items-center justify-center gap-2 text-white/40"
  >
    <RouterLink
      v-if="commentsOption"
      to="/reviews"
      class="inline-flex items-center gap-2 rounded-md px-3 pb-1 pt-2 shadow-sm hover:bg-white/10"
    >
      <ChatBubbleBottomCenterTextIcon class="mb-1 h-4 w-4" />
      <span class="text-xs">Customer Voices</span>
    </RouterLink>

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
</template>

<script setup lang="ts">
import IconFacebook from "@/components/icons/IconFacebook.vue";
import {
  ChatBubbleBottomCenterTextIcon,
  DevicePhoneMobileIcon,
  MapIcon,
} from "@heroicons/vue/20/solid";
import IconViber from "@/components/icons/IconViber.vue";

const props = defineProps({
  commentsOption: {
    type: Boolean,
    default: false,
  },
});
</script>
