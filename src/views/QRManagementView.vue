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
        <div
          v-if="qr"
          class="animate-fade-down animate-once animate-duration-700 flex flex-col items-center justify-center gap-4"
        >
          <div
            ref="qrDiv"
            class="relative isolate overflow-hidden rounded-md border border-white/50 bg-gray-900 px-2 pb-12 pt-2 shadow-md"
          >
            <img
              v-if="!regeneratingQR"
              class="h-52 rounded-md"
              alt="qr"
              :src="qr ? qr.data : qr"
            />
            <div v-else class="flex items-center justify-center">
              <svg
                class="h-52 w-52 bg-white/5 text-white/20"
                viewBox="0 0 300 150"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="15"
                  stroke-linecap="round"
                  stroke-dasharray="300 385"
                  stroke-dashoffset="0"
                  d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    calcMode="spline"
                    dur="6"
                    values="685;-685"
                    keySplines="0 0 1 1"
                    repeatCount="indefinite"
                  ></animate>
                </path>
              </svg>
            </div>
            <div class="absolute bottom-0 -mx-2 w-full pb-1 text-center">
              <h2 class="text-2xl font-bold uppercase drop-shadow">Scan Me</h2>
            </div>
          </div>

          <div class="mb-2 mt-2 flex gap-2">
            <div class="flex">
              <RouterLink
                to="/"
                class="inline-flex items-center rounded-l-md px-2 pb-1 pt-2 text-xs shadow-sm ring-1 ring-white/5 hover:bg-white/10"
              >
                <HomeIcon class="mb-1 h-3 text-white/50" />
              </RouterLink>
              <RouterLink
                to="/products"
                class="inline-flex items-center px-2 pb-1 pt-2 text-xs shadow-sm ring-1 ring-white/5 hover:bg-white/10"
              >
                <ShoppingCartIcon class="mb-1 h-3 text-white/50" />
              </RouterLink>
              <RouterLink
                to="/reviewManagement"
                class="inline-flex items-center rounded-r-md px-2 pb-1 pt-2 text-xs shadow-sm ring-1 ring-white/5 hover:bg-white/10"
              >
                <ChatBubbleBottomCenterTextIcon
                  class="mb-1 h-3 text-white/50"
                />
              </RouterLink>
            </div>

            <button
              class="inline-flex items-center gap-2 rounded-md px-2 pb-1 pt-2 text-xs shadow-sm ring-1 ring-white/5 hover:bg-white/10"
              @click="regenerateQRCode"
            >
              <ArrowPathRoundedSquareIcon class="mb-1 h-3 text-white/50" />
              <span>Regenerate</span>
            </button>

            <button
              class="inline-flex items-center gap-2 rounded-md px-2 pb-1 pt-2 text-xs shadow-sm ring-1 ring-white/5 hover:bg-white/10"
              @click="share"
            >
              <ShareIcon class="mb-1 h-3 text-white/50" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <ThemeFooter :comments-option="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BrandLogo from "@/components/BrandLogo.vue";
import ThemeFooter from "@/components/ThemeFooter.vue";
import { useSystemSettingsStore } from "@/stores/useSystemSettingsStore";
import { computed, onMounted, ref } from "vue";
import QRCode from "qrcode";
import {
  ArrowPathRoundedSquareIcon,
  ShareIcon,
  HomeIcon,
  ShoppingCartIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/vue/20/solid";
import html2canvas from "html2canvas";

const systemSettingStore = useSystemSettingsStore();
const qrDiv = ref<HTMLDivElement | null>(null);
const regeneratingQR = ref<boolean>(false);

async function generateQRCode() {
  try {
    // Get the current domain from the URL bar
    const currentDomain = window.location.origin;

    // Generate the QR code as a Base64 string
    const qrCodeBase64 = await QRCode.toDataURL(currentDomain);

    await systemSettingStore.addSetting({ name: "qr", data: qrCodeBase64 });
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
}

async function regenerateQRCode() {
  try {
    // Get the current domain from the URL bar
    regeneratingQR.value = true;
    const currentDomain = window.location.origin;

    // Generate the QR code as a Base64 string
    const qrCodeBase64 = await QRCode.toDataURL(currentDomain);

    await systemSettingStore.editSetting("qr", {
      name: "qr",
      data: qrCodeBase64,
    });
    regeneratingQR.value = false;
  } catch (error) {
    console.error("Error generating QR code:", error);
    regeneratingQR.value = false;
  }
}

async function share() {
  // Check if the qrDiv exists
  if (!qrDiv.value) {
    console.error("Element with id 'qrDiv' not found.");
    return;
  }

  try {
    // Capture the div as an image
    const canvas = await html2canvas(qrDiv.value);
    const dataUrl: string = canvas.toDataURL("image/png");

    // Convert the data URL to a Blob
    const blob: Blob = await (await fetch(dataUrl)).blob();

    // Create a shareable file object
    const file: File = new File([blob], "CafeBreeze.png", {
      type: "image/png",
    });

    // Log the file object to ensure it's created correctly
    console.log("File to share:", file);

    // Use the navigator.share method to share the screenshot
    if ("share" in navigator) {
      await navigator.share({
        files: [file],
        title: "Cafè Breeze",
        text: "Check out our cafe!",
      });
      console.log("QR shared successfully!");
    } else {
      console.error("Sharing not supported on this browser.");
    }
  } catch (error) {
    console.error("Error capturing or sharing screenshot:", error);
  }
}

const qr = computed(() => {
  const qrSettingIdx = systemSettingStore.settings.findIndex(
    (s) => s.name === "qr",
  );
  if (qrSettingIdx !== -1) {
    return systemSettingStore.settings[qrSettingIdx];
  }
  return null;
});

onMounted(async function () {
  // check if the QR code setting is available if not generate one and save
  const qrSetting = await systemSettingStore.fetchSetting("qr");

  if (!qrSetting) {
    // gen a new QR
    await generateQRCode();
  }
});
</script>

<style scoped></style>
