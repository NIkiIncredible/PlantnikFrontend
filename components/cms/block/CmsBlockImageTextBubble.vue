<script setup lang="ts">
import type { CmsBlockImageTextBubble } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageTextBubble;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftText = getSlotContent("left-text");
const leftImage = getSlotContent("left-image");
const centerText = getSlotContent("center-text");
const centerImage = getSlotContent("center-image");
const rightText = getSlotContent("right-text");
const rightImage = getSlotContent("right-image");
</script>
<template>
  <div class="cms-block-image-text-bubble columns-3">
    <div class="cms-element-column p-4 pl-0">
      <div class="flex justify-center text-white fill-white">
        <CmsGenericElement
            :content="leftImage"
            class="object-center rounded-full fill-white stroke-white"
            style="height: calc(100vw / 3 - 64px); width: calc(100vw / 3 - 64px)"
        />
      </div>
      <CmsGenericElement :content="leftText" />
    </div>
    <div class="cms-element-column p-4">
      <div class="flex justify-center text-white">
        <CmsGenericElement
            :content="centerImage"
            class="object-center rounded-full"
            style="height: calc(100vw / 3 - 64px); width: calc(100vw / 3 - 64px)"
        />
      </div>
      <CmsGenericElement :content="centerText" />
    </div>
    <div class="cms-element-column p-4 pr-0">
      <div class="flex justify-center">
        <CmsGenericElement
            :content="rightImage"
            class="object-center rounded-full"
            style="height: calc(100vw / 3 - 64px); width: calc(100vw / 3 - 64px)"
        />
      </div>
      <CmsGenericElement :content="rightText" />
    </div>
  </div>
</template>