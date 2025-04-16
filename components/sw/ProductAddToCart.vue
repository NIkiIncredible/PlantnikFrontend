<script setup lang="ts">
import { useCmsTranslations } from "@shopware/composables";
import { getCmsTranslate } from "@shopware/helpers";
import { defu } from "defu";
import { toRefs } from "vue";
import {
  useAddToCart,
  useCartErrorParamsResolver,
  useCartNotification,
  useNotifications,
} from "#imports";
import type { Schemas } from "#shopware";
import {Plus} from "lucide-vue-next"

const { pushSuccess, pushError } = useNotifications();
const { getErrorsCodes } = useCartNotification();
const { resolveCartError } = useCartErrorParamsResolver();
const props = defineProps<{
  product: Schemas["Product"];
}>();

type Translations = {
  product: {
    addedToCart: string;
    qty: string;
    addToCart: string;
  };
  errors: {
    [key: string]: string;
  };
};

let translations: Translations = {
  product: {
    addedToCart: "has been added to cart.",
    qty: "Qty",
    addToCart: "Add to cart",
  },
  errors: {
    "product-stock-reached":
        "The product {name} is only available {quantity} times",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const { product } = toRefs(props);
const { addToCart, quantity } = useAddToCart(product);

const addToCartProxy = async () => {
  await addToCart();
  const errors = getErrorsCodes();
  for (const element of errors) {
    const { messageKey, params } = resolveCartError(element);
    pushError(getCmsTranslate(translations.errors[messageKey], params));
  }

  if (!errors.length)
    pushSuccess(
        `${props.product?.translated.name} ${translations.product.addedToCart}`,
    );
};

import { Label } from '@/components/ui/label'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
</script>

<template>
  <div class="flex flex-row mt-10">
    <div class="basis-1/4 relative">
      <NumberField id="qty" data-testid="product-quantity"
                   :default-value="18"
                   :max="product.calculatedMaxPurchase"
                   :min="product.minPurchase || 1"
                   :step="product.purchaseSteps || 1"
                   v-model="quantity">
        <Label for="qty">{{ translations.product.qty }}</Label>
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>
    <div class="basis-3/4 ml-4 flex items-end">
      <Button
          variant="default"
          :disabled="!product.available"
          @click="addToCartProxy"
          class="w-full hover:cursor-pointer"
      >
        <Plus class="w-4 h-4 mr-2"/>
        {{ translations.product.addToCart }}
      </Button>

      <button
          v-if="false"
          :disabled="!product.available"
          class="py-2 px-6 w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 transition ease-in-out hover:bg-gradient-to-l duration-300 cursor-pointer border border-transparent rounded-md flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :class="{
            'opacity-50 cursor-not-allowed': !product.available,
          }"
          data-testid="add-to-cart-button"
          @click="addToCartProxy"
      >
        🛍 {{ translations.product.addToCart }}
      </button>
    </div>
  </div>
</template>