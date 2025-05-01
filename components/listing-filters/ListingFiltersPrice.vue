<script
    setup
    lang="ts"
    generic="
    ListingFilter extends {
      code: string;
      min?: number;
      max?: number;
      label: string;
    }
  "
>
import {computed, ref, watch} from "vue";
import {getFormattedPrice} from "@shopware/helpers";
import type {Schemas} from "#shopware";

const emits =
    defineEmits<
        (e: "select-value", value: { code: string; value: unknown }) => void
    >();

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: Schemas["ProductListingResult"]["currentFilters"];
}>();

type Translations = {
  listing: {
    min: string;
    max: string;
  };
};

const translations: Translations = {
  listing: {
    min: "Min",
    max: "Max",
  },
};

const route = useRoute();
const minPrice = !Number.isNaN(Number(route.query["min-price"]))
    ? Number(route.query["min-price"])
    : props.filter?.min || 0;

const maxPrice = !Number.isNaN(Number(route.query["max-price"]))
    ? Number(route.query["max-price"])
    : props.filter?.max || 0;

const prices = ref([minPrice, maxPrice]);

const minPriceValue = computed(() => prices.value[0]);
const maxPriceValue = computed(() => prices.value[1]);

function onMinPriceChange(newPrice: number, oldPrice: number) {
  if (newPrice === oldPrice || oldPrice === 0) return;
  emits("select-value", {
    code: "min-price",
    value: newPrice,
  });
}

const debounceMinPriceUpdate = useDebounceFn(onMinPriceChange, 500);
watch(minPriceValue, debounceMinPriceUpdate);

function onMaxPriceChange(newPrice: number, oldPrice: number) {
  if (newPrice === oldPrice || oldPrice === 0) return;
  emits("select-value", {
    code: "max-price",
    value: newPrice,
  });
}

const debounceMaxPriceUpdate = useDebounceFn(onMaxPriceChange, 500);
watch(maxPriceValue, debounceMaxPriceUpdate);
</script>

<template>
  <AccordionTrigger>
    {{ props.filter.label }}
  </AccordionTrigger>

  <AccordionContent class="pt-5">
    <Slider
        v-model="prices"
        :max="Math.round(maxPrice)"
        :min="Math.round(minPrice)"
        :step="1"
        :min-steps-between-thumbs="1"
    />
    <div class="flex justify-between pt-1">
      <div>{{ getFormattedPrice(prices[0]) }}€</div>
      <div>{{ getFormattedPrice(prices[1]) }}€</div>
    </div>
  </AccordionContent>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
