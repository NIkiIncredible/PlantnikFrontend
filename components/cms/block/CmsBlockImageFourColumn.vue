<script setup lang="ts">
import type { CmsBlockImageFourColumn } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageFourColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerLeftContent = getSlotContent("center-left");
const centerRightContent = getSlotContent("center-right");
</script>
<template>
  <div class="cms-block-image-four-column grid md:grid-cols-4 gap-10">
    <CmsGenericElement :content="leftContent" />
    <CmsGenericElement :content="centerLeftContent" />
    <CmsGenericElement :content="centerRightContent" />
    <CmsGenericElement :content="rightContent" />
  </div>
</template>

<style scoped>
@reference "~/assets/css/tailwind.css";
.cms-block-image-four-column .cms-element-image {
  @apply object-cover;
}

.cms-block-image-four-column {
  @apply md:grid-cols-4 gap-10;
}
</style>