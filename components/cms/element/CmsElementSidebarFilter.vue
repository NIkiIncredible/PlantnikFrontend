<script setup lang="ts">
import type { CmsElementSidebarFilter } from "@shopware/composables";

import ListingFilters from "~/components/listing-filters/ListingFilters.vue";

defineProps<{
  content: CmsElementSidebarFilter;
}>();
</script>
<template>
  <div class="max-w-screen-xl mx-auto">
    <ListingFilters :content="content" />
  </div>
</template>