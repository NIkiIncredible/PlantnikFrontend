<template>
  <div
      class="absolute top-0 left-0 w-full h-full bg-secondary/70 flex justify-center items-center z-40 rounded-lg cursor-progress">
    <Loader/>
  </div>
</template>

<script setup lang=ts>
import Loader from "./Loader.vue";
</script>
