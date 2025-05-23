<script setup lang="ts">
import type {CmsElementProductSlider, SliderElementConfig,} from "@shopware/composables";
import type {ComputedRef} from "vue";
import {computed, onMounted, ref, useTemplateRef} from "vue";
import {useCmsElementConfig} from "#imports";

const props = defineProps<{
  content: CmsElementProductSlider;
}>();
const {getConfigValue} = useCmsElementConfig(props.content);

const productSlider = useTemplateRef("productSlider");
const slidesToShow = ref<number>();
const products = computed(() => props.content?.data?.products ?? []);
const config: ComputedRef<SliderElementConfig> = computed(() => ({
  minHeight: {
    value: "300px",
    source: "static",
  },
  verticalAlign: {
    source: "static",
    value: getConfigValue("verticalAlign") || "",
  },
  displayMode: {
    value: "contain",
    source: "static",
  },
  navigationDots: {
    value: "",
    source: "static",
  },
  navigationArrows: {
    value: getConfigValue("navigation") ? "outside" : "",
    source: "static",
  },
}));

onMounted(() => {
    let temp = 4;
    const minWidth = +getConfigValue("elMinWidth").replace(/\D+/g, "");
    if (productSlider.value?.clientWidth) {
      temp = Math.ceil(productSlider.value?.clientWidth / (minWidth * 1.2));
    }
    slidesToShow.value = temp;
});

const autoplay = computed(() => getConfigValue("rotate"));
const title = computed(() => getConfigValue("title"));
const border = computed(() => getConfigValue("border"));
</script>
<template>
  <div ref="productSlider" class="cms-element-product-slider">
    <h3 v-if="title" class="mb-5 text-lg font-bold text-secondary-700">
      {{ title }}
    </h3>
    <div v-if="products.length <= 0" class="flex">
      <ProductCardSkeleton
          v-for="n in 10"/>
    </div>

    <div :class="{ 'py-5 border border-secondary-300': border }">
      <SwSlider
          :config="config"
          gap="1.25rem"
          :slides-to-show="slidesToShow"
          :slides-to-scroll="1"
          :autoplay="autoplay"
      >
        <SwProductCard
            v-if="products.length > 0"
            v-for="product of products"
            :key="product.id"
            class="h-full"
            :product="product"
            :layout-type="getConfigValue('boxLayout')"
            :display-mode="getConfigValue('displayMode')"
        />


      </SwSlider>
    </div>
  </div>
</template>