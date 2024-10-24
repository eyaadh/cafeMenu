<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative w-full transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:p-6"
            >
              <div>
                <div class="relative isolate mt-3 text-center">
                  <DialogTitle
                    as="h3"
                    class="border-b pb-2 text-base font-semibold leading-6 text-gray-900"
                  >
                    {{ props.title }}
                  </DialogTitle>

                  <button
                    class="absolute right-0 top-0 h-4 w-4 hover:text-gray-500"
                    @click="open = !open"
                  >
                    <XCircleIcon />
                  </button>

                  <div class="mt-2">
                    <slot name="body" />
                  </div>
                </div>
              </div>
              <div
                class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
              >
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";

const open = ref(false);

const props = defineProps({
  title: {
    default: "Default title",
    type: String,
  },
});

const openDialog = () => {
  open.value = true;
};

const closeDialog = () => {
  open.value = false;
};

defineExpose({ openDialog, closeDialog });

const emits = defineEmits(["dialogOpen", "dialogClose"]);

watch(
  () => open.value,
  (newValue) => {
    if (newValue) {
      emits("dialogOpen");
    } else {
      emits("dialogClose");
    }
  },
);
</script>
