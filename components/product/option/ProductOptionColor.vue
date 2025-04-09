<template>
  <div :class="{'product-option-color': true, 'ring-primary': isActive}"
       :style="'background:' + (option.media ? 'url(' + option.media?.url + ') center' : option.colorHexCode)"
  >
  </div>
</template>

<script setup lang=ts>
import type {components} from "~/api-types/storeApiTypes";

const props = defineProps<{
  option: components["schemas"]["PropertyGroupOption"],
  isActive: boolean,
}>()
</script>

<style scoped>
@reference '@/assets/css/tailwind.css';

.product-option-color {
  @apply h-11 w-11 rounded-md m-1 ring-offset-1 ring-border ring-2 bg-center;
  &:hover {
    @apply cursor-pointer ring-accent-foreground
  }
}
</style>