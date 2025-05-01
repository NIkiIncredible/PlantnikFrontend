<template>
  <div class="rounded-md m-1 ring-2 ring-input bg-center hover:cursor-pointer hover:ring-accent-foreground"
       :class="{ 'product-option-color': true,'ring-primary': isActive,'h-5 w-5': size === 'sm','h-11 w-11': size === 'lg'}"
       :style="'background:' + (option.media ? 'url(' + option.media?.url + ') center' : option.colorHexCode)"
       :aria-label="option.name"
       :title="option.name"
  >
  </div>
</template>

<script setup lang="ts">
interface Option {
  media?: {
    url: string;
  }
  colorHexCode?: string;
  name: string;
}

interface Props {
  option: Option;
  isActive?: boolean;
  size?: "sm" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  size: "lg"
})

</script>