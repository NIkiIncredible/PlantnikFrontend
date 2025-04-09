<template>
  <div class="bg-accent">
    <div class="top-bar flex justify-between">
      <div class="top-bar-section-left flex gap-6">
        <div class="top-bar-info-item inline-flex items-center gap-1.5" v-for="item in topbarItems">
          <component :is="item.icon" :size="20" class="text-primary"></component>
          <span class="text-sm font-normal" v-html="item.transKey"></span>
        </div>
      </div>
      <div class="top-bar-section-right text-sm font-normal">
        <!-- TODO: Make widgets for changing currency and lang        -->
        Euro, Lang
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Package2, Truck} from 'lucide-vue-next'

const {t} = useI18n();
const topbarItems = ref([
  {
    icon: Truck,
    transKey: t("topbar.info-items-fast-transport"),
  },
  {
    icon: Package2,
    transKey: t("topbar.info-items-free-shipping"),
  }
])
</script>

<style scoped>
@reference "~/assets/css/tailwind.css";

.top-bar {
  @apply container m-auto py-3;
}
</style>