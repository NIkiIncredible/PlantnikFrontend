<template>
  <div class="cms-section-default" :class="{
    'container' : layoutStyles.sizingMode === 'boxed',
    'bg-cover': layoutStyles.backgroundSize === 'cover',
   ...cssClasses
  }" :styles="layoutStyles">
    <CmsGenericBlock
        v-for="cmsBlock in content.blocks"
        :key="cmsBlock.id"
        :content="cmsBlock"
    />
  </div>
</template>

<script setup lang="ts">
import type {CmsSectionDefault} from "@shopware/composables";
import {getCmsLayoutConfiguration} from "@shopware/helpers";

const props = defineProps<{
  content: CmsSectionDefault;
}>();

const {cssClasses, layoutStyles} = getCmsLayoutConfiguration(props.content);
</script>

<style scoped>
:deep(h1) {
  font-family: "Sour Gummy", cursive;
}

:deep(h2) {
  font-family: "Sour Gummy", cursive;
}
</style>