<script setup lang="ts">
import {useCmsTranslations} from "@shopware/composables";
import {defu} from "defu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

defineProps<{
  total: number;
  current: number;
  itemsPerPage?: number;
}>();

type Translations = {
  listing: {
    previous: string;
    next: string;
  };
};

let translations: Translations = {
  listing: {
    previous: "Previous",
    next: "Next",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

defineEmits<(e: "changePage", page: number) => void>();
</script>
<template>
  <div class="sw-pagination">
    <Pagination v-slot="{page}" :page="current" :items-per-page="1" :total="total" :default-page="1">
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious @click="$emit('changePage', current - 1)"/>

        <template v-for="(item, index) in items" :key="index">
          <PaginationItem
              v-if="item.type === 'page'"
              :value="item.value"
              :is-active="item.value === page"
              @click="$emit('changePage', item.value)"
          >
            {{ item.value }}
          </PaginationItem>
        </template>

        <PaginationEllipsis :index="4" v-if="total > 5"/>

        <PaginationNext @click="$emit('changePage', current + 1)"/>
      </PaginationContent>
    </Pagination>

    <nav hidden
         class="relative z-0 inline-flex rounded-md shadow-sm space-x-px"
         aria-label="Pagination"
    >
      <button
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"
          @click="$emit('changePage', current - 1)"
      >
        <span class="sr-only">{{ translations.listing.previous }}</span>
        <!-- Heroicon name: solid/chevron-left -->
        <div class="w-5 h-5 i-carbon-chevron-left"/>
      </button>
      <button
          v-if="current > 2"
          class="bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
          @click="$emit('changePage', 1)"
      >
        <span class="sr-only">Page </span>1
      </button>
      <span
          v-if="current - 1 > 2"
          class="relative inline-flex items-center px-4 py-2 border border-secondary-300 bg-white text-sm font-medium text-secondary-700"
      >
      ...
    </span>
      <button
          v-if="current > 1"
          class="bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
          :class="[current == 2 ? 'rounded-l-md border border-secondary-300' : '']"
          @click="$emit('changePage', current - 1)"
      >
        <span class="sr-only">Page </span>{{ current - 1 }}
      </button>
      <button
          aria-current="page"
          class="bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
          :class="[
        current - 1 >= 1 ? '' : 'rounded-l-md border border-secondary-300',
        total == current ? 'rounded-r-md border border-secondary-300' : '',
      ]"
      >
        <span class="sr-only">Page </span>{{ current }}
      </button>
      <button
          v-if="current < total"
          class="bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
          :class="[
        total == current + 1 ? 'rounded-r-md border border-secondary-300' : '',
      ]"
          @click="$emit('changePage', current + 1)"
      >
        <span class="sr-only">Page </span>{{ current + 1 }}
      </button>
      <span
          v-if="total - current > 2"
          class="relative inline-flex items-center px-4 py-2 border border-secondary-300 bg-white text-sm font-medium text-secondary-700"
      >
      ...
    </span>
      <button
          v-if="total - current > 1"
          class="bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
          @click="$emit('changePage', total)"
      >
        {{ total }}
      </button>
      <button
          v-if="total > current + 1"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"
          @click="$emit('changePage', current + 1)"
      >
        <span class="sr-only">{{ translations.listing.next }}</span>
        <!-- Heroicon name: solid/chevron-right -->
        <div class="w-5 h-5 i-carbon-chevron-right"/>
      </button>
    </nav>
  </div>
</template>

<!--
<Pagination v-slot="{ page }" :items-per-page="10" :total="100" :sibling-count="1" show-edges :default-page="2">
    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
      <PaginationFirst />
      <PaginationPrev />

      <template v-for="(item, index) in items">
        <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
          <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis v-else :key="item.type" :index="index" />
      </template>

      <PaginationNext />
      <PaginationLast />
    </PaginationList>
  </Pagination>
-->