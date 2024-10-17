<template>
  <div class="h-screen w-full text-white">
    <div
      class="animate-fade-up animate-duration-[900ms] animate-ease-linear animate-fill-both mx-auto flex h-full w-full max-w-3xl flex-col items-center"
    >
      <!--logo -->
      <div>
        <BrandLogo class="w-36 text-gray-100" />
      </div>

      <div
        class="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"
      >
        <div class="flex w-full justify-between">
          <h2 class="text-lg font-medium">Recent reviews</h2>

          <div class="flex gap-2">
            <RouterLink
              to="/"
              class="inline-flex items-center rounded-md bg-white/5 px-2 py-1.5 hover:bg-white/10 focus:outline-none focus:ring-0"
            >
              <HomeIcon class="mb-1 h-3 w-3 text-white" aria-hidden="true" />
            </RouterLink>
            <button
              class="inline-flex items-center rounded-md bg-white/5 px-2 py-1.5 hover:bg-white/10 focus:outline-none focus:ring-0"
              @click="openReviewDialog"
            >
              <ChatBubbleBottomCenterTextIcon
                class="mb-1 h-3 w-3 text-white"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <div
          v-if="reviewStore.approvedReviews.length"
          class="mt-6 space-y-10 divide-y divide-white/10 border-b border-t border-white/10 pb-10"
          v-auto-animate
        >
          <div
            v-for="review in reviewStore.approvedReviews"
            class="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8"
          >
            <div
              class="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8"
            >
              <div class="flex items-center xl:col-span-1">
                <div class="flex items-center">
                  <StarIcon
                    v-for="rating in [0, 1, 2, 3, 4]"
                    :key="rating"
                    :class="[
                      review.rating > rating
                        ? 'text-yellow-400'
                        : 'text-white/50',
                      'h-5 w-5 flex-shrink-0',
                    ]"
                    aria-hidden="true"
                  />
                </div>
                <p class="ml-3 mt-2 text-sm text-white/80">
                  {{ review.rating }}
                  <span class="sr-only"> out of 5 stars</span>
                </p>
              </div>

              <div class="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                <h3 class="text-sm font-medium text-white/80">
                  {{ review.title }}
                </h3>

                <div
                  class="mt-3 space-y-6 whitespace-pre-line text-sm text-white/50"
                  v-html="review.content"
                />
              </div>
            </div>

            <div
              class="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3"
            >
              <p class="font-medium text-white/80">{{ review.author }}</p>
              <time
                :datetime="
                  review.datetime ? review.datetime : new Date().toISOString()
                "
                class="ml-4 border-l border-gray-200 pl-4 text-white/50 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
              >
                {{ review.date }}
              </time>
            </div>
          </div>
        </div>
        <div v-if="reviewStore.approvedReviews.length === 0">
          <p class="-mx-1 mt-3 whitespace-pre text-sm text-white/50">
            No reviews has been submitted yet.
          </p>
        </div>
      </div>

      <ThemeFooter />
    </div>
  </div>
  <ThemeDialog
    @dialog-close="closeReviewDialog"
    title="We would love to hear from you."
    ref="reviewDialog"
  >
    <template #body>
      <div v-if="successfulFeedbackPost" class="rounded-md bg-green-50 p-4">
        <div>
          <div class="flex items-center justify-center gap-2">
            <div class="flex-shrink-0">
              <CheckCircleIcon
                class="mb-1 h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            </div>
            <h3 class="text-sm font-medium text-green-800">
              Feedback successfully posted
            </h3>
          </div>
          <div class="mt-2 text-sm text-green-700">
            <p>
              Thank you for your feedback. We've heard you, and we truly
              appreciate your kind words and value your input.
            </p>
          </div>
        </div>
      </div>

      <div class="mt-4 grid gap-2 text-start sm:grid-cols-2">
        <div>
          <label
            for="name"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Full name
          </label>
          <div class="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              v-model="reviewForm.author"
              autocomplete="given-name"
              placeholder="Ahmed Iyad Mohamed"
              :class="
                reviewFormValidation.author.$error
                  ? 'ring-red-300'
                  : 'ring-gray-300'
              "
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            for="phone-number"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Phone Number
          </label>
          <div class="mt-2">
            <input
              type="text"
              name="phone-number"
              id="phone-number"
              autocomplete="tel"
              placeholder="7712345"
              v-model="reviewForm.phoneNumber"
              :class="
                reviewFormValidation.phoneNumber.$error
                  ? 'ring-red-300'
                  : 'ring-gray-300'
              "
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div class="col-span-full">
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              v-model="reviewForm.email"
              autocomplete="email"
              placeholder="eyaadh@eyaadh.net"
              :class="
                reviewFormValidation.email.$error
                  ? 'ring-red-300'
                  : 'ring-gray-300'
              "
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div class="col-span-full">
          <fieldset>
            <legend class="block text-sm font-medium leading-6 text-gray-900">
              Select your rating
            </legend>
            <RadioGroup
              v-model="reviewForm.rating"
              class="mt-2 flex items-center space-x-3"
            >
              <RadioGroupOption
                v-for="rating in [1, 2, 3, 4, 5]"
                :key="rating"
                :value="rating"
              >
                <div
                  :class="[
                    'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-amber-200',
                  ]"
                >
                  <StarIcon
                    aria-hidden="true"
                    class="h-5 w-5 flex-shrink-0"
                    :class="
                      rating <= reviewForm.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    "
                  />
                </div>
              </RadioGroupOption>
            </RadioGroup>
          </fieldset>
        </div>

        <div class="col-span-full">
          <label
            for="feedback-heading"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Title
          </label>
          <div class="mt-2">
            <input
              id="feedback-heading"
              name="feedback-heading"
              type="text"
              v-model="reviewForm.title"
              placeholder="The best experience I have had in a cafe."
              :class="
                reviewFormValidation.title.$error
                  ? 'ring-red-300'
                  : 'ring-gray-300'
              "
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div class="col-span-full">
          <label
            for="about"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Feedback
          </label>
          <div class="mt-2">
            <textarea
              id="about"
              name="about"
              rows="3"
              v-model="reviewForm.content"
              :class="
                reviewFormValidation.content.$error
                  ? 'ring-red-300'
                  : 'ring-gray-300'
              "
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <p class="mt-3 text-sm leading-6 text-gray-600">
            Share your thoughts about your experience with us.
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="col-span-full">
        <button
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="postFeedback"
        >
          Post
        </button>
      </div>
    </template>
  </ThemeDialog>
</template>

<script setup lang="ts">
import BrandLogo from "@/components/BrandLogo.vue";
import {
  HomeIcon,
  StarIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/vue/20/solid";
import ThemeFooter from "@/components/ThemeFooter.vue";
import ThemeDialog from "@/components/ThemeDialog.vue";
import { computed, ref } from "vue";
import { RadioGroup, RadioGroupOption } from "@headlessui/vue";
import type { IReview } from "@/types/Reviews";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { CheckCircleIcon } from "@heroicons/vue/20/solid";
import { useReviewsStore } from "@/stores/useReviewsStore";
import dayjs from "dayjs";

const reviewDialog = ref<typeof ThemeDialog | null>(null);
const successfulFeedbackPost = ref<boolean>(false);
const reviewStore = useReviewsStore();

const reviewForm = ref<IReview>({
  id: null,
  title: null,
  rating: 5,
  content: null,
  author: null,
  date: null,
  datetime: null,
  phoneNumber: null,
  email: null,
  status: "pending",
  restricted: false,
});

const reviewFormValidationRules = computed(() => {
  return {
    title: { required },
    rating: { required },
    content: { required },
    author: { required },
    phoneNumber: { required },
    email: { required },
    status: { required },
    restricted: { required },
  };
});

const reviewFormValidation = useVuelidate(
  reviewFormValidationRules,
  reviewForm,
);

async function postFeedback() {
  await reviewFormValidation.value.$validate();
  if (!reviewFormValidation.value.$invalid) {
    reviewForm.value.date = dayjs().format("MMMM D, YYYY");
    reviewForm.value.datetime = dayjs().format("YYYY-MM-DD");
    await reviewStore.addReview(reviewForm.value);

    // once review is submitted we reset the review form
    closeReviewDialog();

    // also show a feedback that the review has been submitted successfully
    successfulFeedbackPost.value = true;
    setTimeout(() => {
      successfulFeedbackPost.value = false;
      reviewDialog.value?.closeDialog();
    }, 4000);
  }
}

function openReviewDialog() {
  reviewDialog.value?.openDialog();
}
function closeReviewDialog() {
  reviewForm.value.id = null;
  reviewForm.value.title = null;
  reviewForm.value.rating = 5;
  reviewForm.value.content = null;
  reviewForm.value.author = null;
  reviewForm.value.date = null;
  reviewForm.value.datetime = null;
  reviewForm.value.phoneNumber = null;
  reviewForm.value.email = null;
  reviewForm.value.status = "pending";
  reviewForm.value.restricted = false;

  reviewFormValidation.value.$reset();
}
</script>

<style scoped></style>
