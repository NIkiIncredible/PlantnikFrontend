<script setup lang="ts">
import type {CmsSectionSidebar} from "@shopware/composables";
import {useCmsSection} from "@shopware/composables";
import {computed} from "vue";

const props = defineProps<{
  content: CmsSectionSidebar;
}>();
const {getPositionContent} = useCmsSection(props.content);

const sidebarBlocks = getPositionContent("sidebar");
const mainBlocks = getPositionContent("main");
const mobileBehavior = computed(() => props.content.mobileBehavior);
</script>

<template>
  <div class="cms-section-sidebar flex flex-col lg:flex-row gap-0 lg:gap-10">
    <div class="lg:flex-8/12 xl:flex-9/12 order-2">
      <CmsGenericBlock
          v-for="cmsBlock in mainBlocks"
          :key="cmsBlock.id"
          class="overflow-auto"
          :content="cmsBlock"
      />
    </div>
    <div
        :class="{
        'align-top col-span-12 lg:flex-4/12 xl:flex-3/12 order-1':
          mobileBehavior !== 'hidden',
        'hidden md:block': mobileBehavior === 'hidden',
      }"
    >
      <CmsGenericBlock
          v-for="cmsBlock in sidebarBlocks"
          :key="cmsBlock.id"
          class="lg:sticky top-5"
          :content="cmsBlock"
      />
    </div>
  </div>
</template>