<template>
  <div class="icon w-full flex items-center justify-center" style="width: 100%; height: 100%">
    <component
        :is="icon"
        v-if="icon"
        :size="content.config.size.value"
        :color="content.config.color.value"
    />
    <div v-else>Icon not found</div>
  </div>
</template>

<script setup lang=ts>
import type {CmsElementIcon} from "~/types/CmsElementIcon.d.ts";
import * as icons from "lucide-vue-next";

const props = defineProps<{
  content: CmsElementIcon;
}>();

const iconName = props.content.config.icon.value;
const icon = computed(() => icons[iconName]);
</script>