<template>
  <div
    class="animate-fade-up animate-duration-[900ms] flex h-screen w-full items-center justify-center bg-gray-900 text-white"
  >
    <div class="flex h-full w-full flex-col px-4 sm:max-w-3xl xl:px-0">
      <div class="border-b border-white/20 py-5">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h1 id="message-heading" class="text-base font-semibold leading-6">
              Product Management
            </h1>
            <p class="mt-1 truncate text-sm text-gray-500">
              Update your products accordingly
            </p>
          </div>

          <ThemeNavMenu>
            <template #pageNavs>
              <MenuItem v-slot="{ active }">
                <button
                  @click="openProductDialog"
                  type="button"
                  :class="[
                    active ? 'bg-gray-100/80 text-gray-900' : 'text-white',
                    'flex w-full items-center justify-start gap-2 px-4 py-2 text-sm',
                  ]"
                >
                  <PlusCircleIcon class="mb-1 h-4 w-4" aria-hidden="true" />
                  <span class="drop-shadow">Add Products</span>
                </button>
              </MenuItem>

              <MenuItem v-slot="{ active }">
                <button
                  @click="openCategoriesDialog"
                  type="button"
                  :class="[
                    active ? 'bg-gray-100/80 text-gray-900' : 'text-white',
                    'flex w-full items-center justify-start gap-2 border-b border-white/10 px-4 py-2 text-sm',
                  ]"
                >
                  <TagIcon class="mb-1 h-4 w-4" aria-hidden="true" />
                  <span class="drop-shadow">Manage Categories</span>
                </button>
              </MenuItem>
            </template>
          </ThemeNavMenu>
        </div>
      </div>
      <div class="h-full w-full overflow-auto [&::-webkit-scrollbar]:hidden">
        <div class="mx-auto overflow-hidden py-8" v-auto-animate>
          <div
            class="mt-6 h-full w-full"
            v-for="category in categoriesStore.categories"
          >
            <div class="flex gap-2 border-b border-white/5">
              <HashtagIcon class="h-4 w-4" />
              <h2 class="font-semibold">{{ category.name }}</h2>
            </div>
            <div
              class="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4"
            >
              <div
                v-for="product in productsStore.groupItemsByCategory(category)
                  .value"
                :key="product.id ? product.id : new Date().getTime()"
                class="group relative overflow-hidden rounded-md border border-white/10 py-4 shadow-md sm:py-6"
                @click="loadEditData(product)"
              >
                <div class="absolute right-1 top-1">
                  <PencilSquareIcon class="h-3 w-3" />
                </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ThemeDialog
    @dialog-close="closeProductDialog"
    title="Product Management"
    ref="productsDialog"
  >
    <template #body>
      <div class="mt-2 grid gap-2 text-start sm:grid-cols-2">
        <div>
          <label
            for="product-name"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <div class="mt-2">
            <input
              v-model="productForm.name"
              type="text"
              name="product-name"
              id="product-name"
              :class="
                productFormValidation.name.$error
                  ? 'ring-red-300'
                  : 'ring-gray-300'
              "
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Name of the product"
            />
          </div>
        </div>
        <div>
          <label
            for="product-price"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Price
          </label>
          <div class="relative mt-2 rounded-md shadow-sm">
            <div
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            >
              <span class="text-gray-500 sm:text-sm">MRF</span>
            </div>
            <input
              v-model="productForm.price"
              type="number"
              name="product-price"
              id="product-price"
              :class="
                productFormValidation.name.$error
                  ? 'ring-red-300'
                  : 'ring-gray-300'
              "
              class="block w-full rounded-md border-0 py-1.5 pl-12 pr-2 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0.00"
              aria-describedby="price-currency"
            />
          </div>
        </div>
        <div>
          <ThemeCombobox
            label="Category"
            :items="categoriesStore.categories"
            :validation-error="productFormValidation.category.$error"
            v-model="productForm.category"
          />
        </div>
        <div>
          <label
            for="product-limit-per-order"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Limit Per Order
          </label>
          <div class="mt-2">
            <input
              v-model="productForm.limitPerOrder"
              type="number"
              name="product-limit-per-order"
              id="product-limit-per-order"
              :class="
                productFormValidation.limitPerOrder.$error
                  ? 'ring-red-300'
                  : 'ring-gray-300'
              "
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0"
            />
          </div>
        </div>
        <div class="col-span-full">
          <label
            for="cover-photo"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Product Image
          </label>
          <div
            :class="
              productFormValidation.image.$error
                ? 'border-red-300'
                : 'border-gray-900/25'
            "
            class="mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10"
          >
            <div v-if="!productForm.image" class="text-center">
              <PhotoIcon
                class="mx-auto h-12 w-12 text-gray-300"
                aria-hidden="true"
              />
              <div
                class="mt-4 flex justify-center text-sm leading-6 text-gray-600"
              >
                <label
                  for="file-upload"
                  class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    class="sr-only"
                    @change="onFileChange"
                    accept="image/*"
                  />
                </label>
              </div>
              <p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF</p>
            </div>
            <div v-else class="aspect-h-1 aspect-w-1">
              <label for="file-upload-masked">
                <img
                  class="h-52 w-full object-cover object-center"
                  :alt="productForm.name ? productForm.name : 'image'"
                  :src="productForm.image ? productForm.image : ''"
                />
                <input
                  id="file-upload-masked"
                  name="file-upload-masked"
                  type="file"
                  class="sr-only"
                  @change="onFileChange"
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        :class="productForm.id ? '' : 'sm:col-start-2'"
        class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="saveProduct"
      >
        Save
      </button>
      <button
        v-if="productForm.id"
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:mt-0"
        @click="deleteProduct"
      >
        Delete
      </button>
      <button
        type="button"
        :class="productForm.id ? 'sm:col-span-2' : ''"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
        @click="productsDialog?.closeDialog()"
      >
        Cancel
      </button>
    </template>
  </ThemeDialog>

  <ThemeDialog
    @dialog-close="closeCategoriesDialog"
    title="Categories Management"
    ref="categoriesDialog"
  >
    <template #body>
      <div
        v-if="categoryRemoveError"
        class="animate-fade-down animate-duration-700 border-l-4 border-red-400 bg-red-50 p-4"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon
              class="h-5 w-5 text-red-400"
              aria-hidden="true"
            />
          </div>
          <div class="ml-3 text-start">
            <p class="text-[13px] text-red-700">
              This category cannot be removed, there are items associated with
              it.
            </p>
          </div>
        </div>
      </div>
      <div class="mt-4 flex h-full w-full flex-col">
        <div class="flex w-full justify-end">
          <div class="flex w-full flex-col items-start">
            <label
              for="category-name"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Category Name
            </label>
            <div class="relative isolate w-full">
              <input
                v-model="categoryForm.name"
                type="text"
                name="category-name"
                id="category-name"
                :class="
                  categoryFormValidation.name.$error
                    ? 'ring-red-300'
                    : 'ring-gray-300'
                "
                class="block w-full rounded-md border-0 py-1.5 pr-16 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Name of the category"
              />
              <button
                class="absolute right-0 top-0 flex h-full gap-2 rounded-r-md px-2 pb-0 pt-3 text-xs ring-1 ring-inset ring-gray-300 hover:text-gray-500"
                @click="saveCategory()"
              >
                <CheckCircleIcon class="h-3 w-3" />
                Save
              </button>
            </div>
          </div>
        </div>
        <div class="mt-4 w-full">
          <ul class="flex w-full flex-col gap-2" v-auto-animate>
            <li
              class="flex w-full items-center justify-between border-b py-1"
              v-for="category in categoriesStore.categories"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm">{{ category.name }}</span>
                <span
                  class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 pb-px text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >
                  {{ productsStore.countByCategory(category.id) }}
                </span>
              </div>
              <div class="flex gap-2">
                <button @click="loadCategoryEdit(category)">
                  <PencilSquareIcon class="h-3 hover:text-gray-500" />
                </button>
                <button @click="deleteCategory(category)">
                  <TrashIcon class="h-3 hover:text-gray-500" />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </ThemeDialog>
</template>

<script setup lang="ts">
import { MenuItem } from "@headlessui/vue";
import {
  PlusCircleIcon,
  PhotoIcon,
  TagIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HashtagIcon,
} from "@heroicons/vue/20/solid";
import ThemeDialog from "@/components/ThemeDialog.vue";
import { computed, ref } from "vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useProductsStore } from "@/stores/useProductsStore";
import type { IProduct } from "@/types/Products";
import { PencilSquareIcon } from "@heroicons/vue/24/solid";
import IconMVRF from "@/components/icons/IconMVRF.vue";
import type { ICategory } from "@/types/Categories";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import ThemeCombobox from "@/components/ThemeCombobox.vue";
import ThemeNavMenu from "@/components/ThemeNavMenu.vue";

const productsDialog = ref<typeof ThemeDialog | null>(null);
const categoriesDialog = ref<typeof ThemeDialog | null>(null);
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const categoryRemoveError = ref<boolean>(false);

const productForm = ref<IProduct>({
  id: null,
  name: null,
  price: null,
  category: null,
  image: null,
  limitPerOrder: 5,
});

const productFormValidationRules = computed(() => {
  return {
    name: { required },
    price: { required },
    category: { required },
    image: { required },
    limitPerOrder: { required },
  };
});

const productFormValidation = useVuelidate(
  productFormValidationRules,
  productForm,
);

const categoryForm = ref<ICategory>({
  id: null,
  name: null,
});

const categoryFromValidationRules = computed(() => {
  return {
    name: { required },
  };
});

const categoryFormValidation = useVuelidate(
  categoryFromValidationRules,
  categoryForm,
);

async function saveProduct() {
  await productFormValidation.value.$validate();

  if (!productFormValidation.value.$invalid) {
    // if ID is not present add the doc otherwise update the doc
    if (!productForm.value.id) {
      await productsStore.addProduct(productForm.value);
      productsDialog.value?.closeDialog();
    } else {
      await productsStore.editProduct(productForm.value.id, productForm.value);
      productsDialog.value?.closeDialog();
    }
  }
}

function loadEditData(product: IProduct) {
  productForm.value.id = product.id;
  productForm.value.name = product.name;
  productForm.value.price = product.price;
  productForm.value.category = product.category;
  productForm.value.image = product.image;
  productForm.value.limitPerOrder = product.limitPerOrder;

  productsDialog.value?.openDialog();
}

async function deleteProduct() {
  if (productForm.value.id) {
    await productsStore.deleteProduct(productForm.value.id);
    productsDialog.value?.closeDialog();
  }
}

function onFileChange(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files ? fileInput.files[0] : null;

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 500; // Maximum width for the image
        const maxHeight = 500; // Maximum height for the image

        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }

        // Set the canvas dimensions to the new width and height
        canvas.width = width;
        canvas.height = height;

        // Draw the resized image onto the canvas
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress the image (0.7 = 70% quality, adjust as needed)
        // Adjust compression quality if needed
        // Assign the compressed image to the form
        productForm.value.image = canvas.toDataURL("image/jpeg", 0.7);
      };
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsDataURL(file); // Convert file to base64-encoded string
  }
}

function openProductDialog() {
  productsDialog.value?.openDialog();
}

function closeProductDialog() {
  productForm.value.id = null;
  productForm.value.image = null;
  productForm.value.name = null;
  productForm.value.category = null;
  productForm.value.price = null;
  productForm.value.limitPerOrder = 5;

  productFormValidation.value.$reset();
}

function openCategoriesDialog() {
  categoriesDialog.value?.openDialog();
}

function closeCategoriesDialog() {
  categoryForm.value.id = null;
  categoryForm.value.name = null;

  categoryFormValidation.value.$reset();
}

async function saveCategory() {
  await categoryFormValidation.value.$validate();
  if (!categoryFormValidation.value.$invalid) {
    if (!categoryForm.value.id) {
      await categoriesStore.addCategory(categoryForm.value);
    } else {
      await categoriesStore.editCategory(
        categoryForm.value.id,
        categoryForm.value,
      );
    }
    // after saving the category, reset the form
    categoryForm.value.id = null;
    categoryForm.value.name = null;
  }
}

async function deleteCategory(category: ICategory) {
  // check if there are products associated with category before deletion
  if (!productsStore.countByCategory(category.id).value) {
    if (category.id) {
      await categoriesStore.deleteCategory(category.id);
    }
  } else {
    categoryRemoveError.value = true;
    setTimeout(() => {
      categoryRemoveError.value = false;
    }, 10000);
  }
}

function loadCategoryEdit(category: ICategory) {
  categoryForm.value.id = category.id;
  categoryForm.value.name = category.name;
}
</script>
