<script setup lang="ts">
defineOptions({
  name: "CheckoutLayout",
});
</script>
<template>
  <div>
    <LayoutCheckoutHeader />
    <LayoutNotifications />
    <main class="container mx-auto px-4 sm:px-6">
      <slot />
    </main>
  </div>
</template>
