<script setup lang="ts">
import type { CmsBlockGalleryBuybox } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockGalleryBuybox;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const rightContent = getSlotContent("right");
const leftContent = getSlotContent("left");
</script>

<template>
  <div
      class="lg:container mx-auto gap-10 grid-cols-12 grid justify-center"
  >
    <div class="overflow-hidden col-span-6" >
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="col-span-6">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>