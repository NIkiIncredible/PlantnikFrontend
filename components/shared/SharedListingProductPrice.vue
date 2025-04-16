<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  product: Schemas["Product"];
}>();
const { product } = toRefs(props);

const { unitPrice, displayFromVariants, displayFrom, isListPrice, price } =
  useProductPrice(product);
</script>

<template>
  <div :id="product.id">

    <!-- TODO: idk what this should do -->
    <SharedPrice
      v-if="displayFromVariants"
      class="text-lg font-semibold text-secondary-900 basis-2/6 justify-start"
      :value="displayFromVariants"
    >
      <template #beforePrice>
        <span v-if="displayFromVariants">{{ $t("product.price.from") }}</span>
      </template>

      <template #afterPrice v-if="isListPrice">
        <small class="line-through text-destructive">
          <SharedPrice :value="price?.listPrice?.price"/>
        </small>
      </template>
    </SharedPrice>


    <template v-if="isListPrice">
      <SharedPrice
          class="text-lg font-semibold text-secondary-900 basis-2/6 justify-start"
          :value="price?.listPrice?.price"
      >
        <template #beforePrice>
          <span v-if="displayFrom">{{ $t("product.price.from") }}</span>
        </template>
        <template #afterPrice v-if="isListPrice">
          <small class="line-through text-destructive">
            <SharedPrice :value="unitPrice"/>
          </small>
        </template>
      </SharedPrice>
    </template>
    <template v-else>
      <SharedPrice
          class="text-lg font-semibold text-secondary-900 basis-2/6 justify-start"
          :value="unitPrice"
      >
        <template #beforePrice>
          <span v-if="displayFrom">{{ $t("product.price.from") }}</span>
        </template>
      </SharedPrice>
    </template>

  </div>
</template>
