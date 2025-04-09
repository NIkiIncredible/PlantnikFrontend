<template>
  <Card class="product-card relative w-full transition duration-200 hover:shadow-lg loading">
    <CardHeader>
      <div class="product-card-image-wrapper">
          <div
              class="aspect-square object-cover w-full h-full rounded-t-md product-box-img"
          />
      </div>
    </CardHeader>
    <CardContent class="pt-5">
        <CardTitle class="product-card-title h-8 text-ellipsis"></CardTitle>
      <CardDescription class="product-card-description h-16 text-wrap text-ellipsis overflow-hidden truncate"></CardDescription>
    </CardContent>
    <CardFooter class="flex items-center justify-between">
      <div class="product-box-product-price">
        Price
      </div>
      <Button class="hover:cursor-pointer disabled:cursor-not-allowed bg-black hover:bg-black/90">
        <span data-testid="product-box-product-show-details">Details</span>
      </Button>
    </CardFooter>
  </Card>
</template>
<script setup lang="ts">
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
</script>