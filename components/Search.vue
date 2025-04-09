<template>
  <div class="relative w-full max-w-sm items-center">
    <Input id="search" type="text" :placeholder="t('breadcrumbs.search')" class="pr-10"/>

    <span class="absolute end-0 inset-y-0 flex items-center justify-center px-2">
      <Search class="size-6 text-muted-foreground"/>
    </span>
  </div>
</template>

<script setup lang="ts">
import {Search} from 'lucide-vue-next'

const {t} = useI18n();
</script>