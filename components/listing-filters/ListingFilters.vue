<script setup lang="ts">
import type {
  CmsElementProductListing,
  CmsElementSidebarFilter,
} from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { onClickOutside } from "@vueuse/core";
import { defu } from "defu";
import { computed, provide, reactive, ref, useTemplateRef } from "vue";
import type { ComputedRef, UnwrapNestedRefs } from "vue";
import { type LocationQueryRaw, useRoute, useRouter } from "vue-router";
import { useCategoryListing } from "#imports";
import type { Schemas, operations } from "#shopware";

import ListingFilter from "./ListingFilter.vue";

const props = defineProps<{
  content: CmsElementProductListing | CmsElementSidebarFilter;
  listingType?: string;
}>();

type Translations = {
  listing: {
    filters: string;
    sort: string;
    resetFilters: string;
  };
};

let translations: Translations = {
  listing: {
    filters: "Filters",
    sort: "Sort",
    resetFilters: "Reset filters",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const route = useRoute();
const router = useRouter();

const isSortMenuOpen = ref(false);
const {
  changeCurrentSortingOrder,
  filtersToQuery,
  getCurrentFilters,
  getCurrentSortingOrder,
  getInitialFilters,
  getSortingOrders,
  search,
} = useCategoryListing();

const sidebarSelectedFilters: UnwrapNestedRefs<{
  [key: string]: Set<string> | string | number | boolean | undefined;
}> = reactive<{
  manufacturer: Set<string>;
  properties: Set<string>;
  "min-price": string | number | undefined;
  "max-price": string | number | undefined;
  rating: string | number | undefined;
  "shipping-free": boolean | undefined;
}>({
  manufacturer: new Set(),
  properties: new Set(),
  "min-price": undefined,
  "max-price": undefined,
  rating: undefined,
  "shipping-free": undefined,
});

const showResetFiltersButton = computed<boolean>(() => {
  if (
      selectedOptionIds.value.length !== 0 ||
      sidebarSelectedFilters["max-price"] ||
      sidebarSelectedFilters["min-price"] ||
      sidebarSelectedFilters.rating ||
      sidebarSelectedFilters["shipping-free"]
  ) {
    return true;
  }

  return false;
});

const searchCriteriaForRequest: ComputedRef<Schemas["ProductListingCriteria"]> =
    computed(() => ({
      manufacturer: [
        ...(sidebarSelectedFilters.manufacturer as Set<string>),
      ]?.join("|"),
      properties: [...(sidebarSelectedFilters.properties as Set<string>)]?.join(
          "|",
      ),
      "min-price": sidebarSelectedFilters["min-price"] as number,
      "max-price": sidebarSelectedFilters["max-price"] as number,
      order: getCurrentSortingOrder.value as string,
      "shipping-free": sidebarSelectedFilters["shipping-free"] as boolean,
      rating: sidebarSelectedFilters.rating as number,
      search: "",
      limit: route.query.limit ? Number(route.query.limit) : 15,
    }));

for (const param in route.query) {
  if (Object.prototype.hasOwnProperty.call(sidebarSelectedFilters, param)) {
    if (
        sidebarSelectedFilters[param] &&
        typeof sidebarSelectedFilters[param] === "object"
    ) {
      const elements = (route.query[param] as unknown as string).split("|");
      for (const element of elements) {
        sidebarSelectedFilters[param].add(element);
      }
    } else {
      const queryValue = route.query[param];
      if (queryValue !== null && !Array.isArray(queryValue)) {
        sidebarSelectedFilters[param] = queryValue;
      }
    }
  }
}

const onOptionSelectToggle = async ({
                                      code,
                                      value,
                                    }: {
  code: string;
  value: string | number | boolean;
}) => {
  if (!["properties", "manufacturer"].includes(code)) {
    sidebarSelectedFilters[code] = value;
  } else {
    const filterSet = sidebarSelectedFilters[code] as Set<string>;
    const stringValue = String(value);
    if (filterSet?.has(stringValue)) {
      filterSet.delete(stringValue);
    } else {
      filterSet?.add(stringValue);
    }
  }

  await executeSearch();
};

const executeSearch = async () => {
  await search(searchCriteriaForRequest.value);
  const query = filtersToQuery(searchCriteriaForRequest.value);
  const { limit: _, ...queryWithoutLimit } = query; // remove limit from query
  await router.push({
    query: queryWithoutLimit as LocationQueryRaw,
  });
};

const clearFilters = () => {
  (sidebarSelectedFilters.manufacturer as Set<string>).clear();
  (sidebarSelectedFilters.properties as Set<string>).clear();
  sidebarSelectedFilters["min-price"] = undefined;
  sidebarSelectedFilters["max-price"] = undefined;
  sidebarSelectedFilters.rating = undefined;
  sidebarSelectedFilters["shipping-free"] = undefined;
};

const currentSortingOrder = computed({
  get: (): string => getCurrentSortingOrder.value || "",
  set: async (order: string): Promise<void> => {
    await router.push({
      query: {
        ...route.query,
        order,
      },
    });

    await changeCurrentSortingOrder(order, {
      ...(route.query as unknown as operations["searchPage post /search"]["body"]),
      limit: route.query.limit ? Number(route.query.limit) : 15,
    });
  },
});

const selectedOptionIds = computed(() => [
  ...(sidebarSelectedFilters.properties as Set<string>),
  ...(sidebarSelectedFilters.manufacturer as Set<string>),
]);
provide("selectedOptionIds", selectedOptionIds);

async function invokeCleanFilters() {
  clearFilters();
  await executeSearch();
}
const isDefaultSidebarFilter =
    props.content.type === "sidebar-filter" &&
    props.content.config?.boxLayout?.value === "standard";
const dropdownElement = useTemplateRef("dropdownElement");
onClickOutside(dropdownElement, () => {
  isSortMenuOpen.value = false;
});

const handleSortingClick = (key: string) => {
  currentSortingOrder.value = key;
  isSortMenuOpen.value = false;
};
</script>
<template>
  <div>
    <div class="mx-auto m-0" :class="{ 'px-5': isDefaultSidebarFilter }">

      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg! font-semibold py-0!">Filters</h2>
      </div>

      <ClientOnly>
        <div
            class="relative flex items-baseline justify-between pt-6 pb-6 border-b border-gray-200"
            v-show="false"
        >
          <div ref="dropdownElement" class="flex items-center">
            <div class="relative inline-block text-left">
              <div>
                <button
                    type="button"
                    @click="isSortMenuOpen = !isSortMenuOpen"
                    class="group inline-flex justify-center bg-transparent text-base font-medium text-gray-700 hover:text-gray-900"
                    id="menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                >
                  {{ translations.listing.sort }}
                  <div
                      class="i-carbon-chevron-down h-5 w-5 ml-1"
                      :class="{ hidden: isSortMenuOpen }"
                  ></div>
                  <div
                      class="i-carbon-chevron-up h-5 w-5 ml-1"
                      :class="{ hidden: !isSortMenuOpen }"
                  ></div>
                </button>
              </div>
              <div
                  :class="[isSortMenuOpen ? 'absolute' : 'hidden']"
                  class="origin-top-left left-0 lg:origin-top-right lg:right-0 lg:left-auto mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-1000"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabindex="-1"
              >
                <div class="py-1" role="none">
                  <button
                      v-for="sorting in getSortingOrders"
                      :key="sorting.key"
                      @click="handleSortingClick(sorting.key)"
                      :class="[
                      sorting.key === getCurrentSortingOrder
                        ? 'font-medium text-gray-900'
                        : 'text-gray-500',
                    ]"
                      class="block px-4 py-2 text-sm bg-transparent"
                      role="menuitem"
                      tabindex="-1"
                  >
                    {{ sorting.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap" v-if="getInitialFilters.length">
          <Accordion type="multiple" class="w-full">
            <AccordionItem
                v-for="(filter, index) in getInitialFilters"
                :key="`${filter?.id || filter?.code}`"
                :value="`${filter?.id || filter?.code}`"
                class="w-full"
            >
                <ListingFilter
                    @select-filter-value="onOptionSelectToggle"
                    :selected-filters="getCurrentFilters"
                    :filter="filter"
                    class="relative"
                />

            </AccordionItem>
          </Accordion>


          <div v-if="showResetFiltersButton" class="mx-auto mt-4 mb-2">
            <button
                class="w-full justify-center py-2 px-6 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                @click="invokeCleanFilters"
                type="button"
            >
              {{ translations.listing.resetFilters
              }}<span
                class="w-6 h-6 i-carbon-close-filled inline-block align-middle ml-2"
            ></span>
            </button>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>