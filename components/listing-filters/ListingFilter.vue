<script setup lang="ts" generic="ListingFilter extends { code: string }">
import type {Schemas} from "#shopware";
import ListingFiltersPrice from "./ListingFiltersPrice.vue";
import ListingFiltersProperties from "./ListingFiltersProperties.vue";
import ListingFiltersRating from "./ListingFiltersRating.vue";
import ListingFiltersShippingFree from "./ListingFiltersShippingFree.vue";

const emit =
    defineEmits<
        (
            e: "selectFilterValue",
            {code, value}: { code: string; value: string },
        ) => void
    >();

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters?: Schemas["ProductListingResult"]["currentFilters"];
}>();

const cmsMap = () => {
  const map: {
    [key: string]: object;
  } = {
    manufacturer: ListingFiltersProperties,
    properties: ListingFiltersProperties,
    price: ListingFiltersPrice,
    rating: ListingFiltersRating,
    "shipping-free": ListingFiltersShippingFree,
  };

  return map[props.filter?.code];
};
</script>
<template>
  <component
      :is="cmsMap()"
      :filter="filter"
      :selected-filters="selectedFilters"
      @select-value="emit('selectFilterValue', $event)"
  />
</template>
