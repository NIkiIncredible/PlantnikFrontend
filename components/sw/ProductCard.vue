<script setup lang="ts">
import {ApiClientError} from "@shopware/api-client";
import type {BoxLayout, DisplayMode} from "@shopware/composables";
import {useCmsTranslations} from "@shopware/composables";
import {
  buildUrlPrefix,
  getCmsTranslate,
  getProductFromPrice,
  getProductName,
  getProductRoute,
  getSmallestThumbnailUrl,
  getSrcSetForMedia, getTranslatedProperty
} from "@shopware/helpers";
import {useElementSize} from "@vueuse/core";
import {defu} from "defu";
import {computed, ref, toRefs, useTemplateRef} from "vue";
import {
  useAddToCart,
  useCartErrorParamsResolver,
  useCartNotification,
  useNotifications,
  useProductWishlist, useSrcSetSizes,
  useUrlResolver,
} from "#imports";
import type {Schemas} from "#shopware";
//Should be removeable
//TODO: test remove
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '~/components/ui/card'

import {Heart, Percent, Plus, ShoppingBasket} from "lucide-vue-next"
import {Badge} from "~/components/ui/badge";

const {pushSuccess, pushError} = useNotifications();
const {getErrorsCodes} = useCartNotification();
const {resolveCartError} = useCartErrorParamsResolver();

const props = withDefaults(
    defineProps<{
      product: Schemas["Product"];
      layoutType?: BoxLayout;
      isProductListing?: boolean;
      displayMode?: DisplayMode;
    }>(),
    {
      layoutType: "standard",
      displayMode: "standard",
      isProductListing: false,
    },
);

type Translations = {
  product: {
    addedToWishlist: string;
    removedFromTheWishlist: string;
    reason: string;
    cannotAddToWishlist: string;
    addedToCart: string;
    addToCart: string;
    details: string;
    badges: {
      topseller: string;
    };
  };
  errors: {
    [key: string]: string;
  };
};

let translations: Translations = {
  product: {
    addedToWishlist: "has been added to wishlist.",
    removedFromTheWishlist: "has been removed from wishlist.",
    reason: "Reason",
    cannotAddToWishlist: "cannot be added to wishlist.",
    addedToCart: "has been added to cart.",
    addToCart: "Add to cart",
    details: "Details",
    badges: {
      topseller: "Tip",
    },
  },
  errors: {
    "product-stock-reached":
        "The product {name} is only available {quantity} times",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const {product} = toRefs(props);

const {addToCart, isInCart, count} = useAddToCart(product);

const {addToWishlist, removeFromWishlist, isInWishlist} = useProductWishlist(
    product.value.id,
);
const isLoading = ref(false);

const toggleWishlistProduct = async () => {
  isLoading.value = true;

  try {
    if (!isInWishlist.value) {
      await addToWishlist();
      pushSuccess(
          `${props.product?.translated.name} ${translations.product.addedToWishlist}`,
      );
    } else {
      await removeFromWishlist();
      pushError(
          `${props.product?.translated.name} ${translations.product.removedFromTheWishlist}`,
      );
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      const reason = error.details.errors?.[0]?.detail
          ? `${translations.product.reason}: ${error.details.errors?.[0]?.detail}`
          : "";
      return pushError(
          `${props.product?.translated.name} ${translations.product.cannotAddToWishlist}\n${reason}`,
          {
            timeout: 5000,
          },
      );
    }
  } finally {
    isLoading.value = false;
  }
};

const addToCartProxy = async () => {
  await addToCart();
  const errors = getErrorsCodes();
  for (const element of errors) {
    const {messageKey, params} = resolveCartError(element);
    pushError(getCmsTranslate(translations.errors[messageKey], params));
  }

  if (!errors.length)
    pushSuccess(
        `${props.product?.translated.name} ${translations.product.addedToCart}`,
    );
};

const fromPrice = getProductFromPrice(props.product);
const {getUrlPrefix} = useUrlResolver();

const imageElement = useTemplateRef("imageElement");
const {height} = useElementSize(imageElement);

const DEFAULT_THUMBNAIL_SIZE = 10;

function roundUp(num: number) {
  return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
}

// Image generation utils
const srcPath = computed(() => {
  return `${getSmallestThumbnailUrl(
      product.value?.cover?.media,
  )}?&height=${roundUp(height.value)}&fit=cover`;
});
const srcSet: ComputedRef<string> = computed(() => {
  return getSrcSetForMedia((product.value.cover?.media))
});
const srcSetSizes = computed(() => {
  return useSrcSetSizes(srcSet.value)
});
const description = computed(() => {
  return product.value.translated?.metaDescription;
});
</script>

<template>
  <Card class="product-card relative w-full transition duration-200 hover:shadow-lg min-w-48">
    <div class="absolute top-2 left-2 z-10" v-if="product.calculatedCheapestPrice?.listPrice">
      <Badge variant="destructive">
        -{{ product.calculatedCheapestPrice.listPrice?.percentage }}
        <Percent/>
      </Badge>
    </div>

    <CardHeader>
      <div class="product-card-image-wrapper">
        <NuxtLinkLocale
            :to="buildUrlPrefix(getProductRoute(product), getUrlPrefix())"
            class="-m-6 block"
        >
          <img
              ref="imageElement"
              loading="lazy"
              :src="srcPath"
              :srcset="srcSet"
              :alt="getProductName({ product }) || ''"
              class="aspect-square object-cover w-full h-full rounded-t-md"
              data-testid="product-box-img"
          />
        </NuxtLinkLocale>

        <div class="product-card-top absolute top-2 right-2 flex gap-2">
          <Button size="icon"
                  :disabled="isLoading"
                  data-testid="product-box-toggle-wishlist-button"
                  @click="toggleWishlistProduct"
                  aria-label="Add to wishlist"
                  class="hover:cursor-pointer">
            <client-only>
              <Heart :class="{'fill-red-500' : isInWishlist, 'text-red-500': isInWishlist}"></Heart>
              <template #fallback>
                <Heart></Heart>
              </template>
            </client-only>
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent class="pt-5">
      <NuxtLinkLocale :to="buildUrlPrefix(getProductRoute(product), getUrlPrefix())">
        <CardTitle class="product-card-title h-8 text-ellipsis">{{ getProductName({product}) }}</CardTitle>
      </NuxtLinkLocale>

      <CardDescription class="product-card-description h-16 text-wrap text-ellipsis overflow-hidden truncate">{{description}}</CardDescription>
    </CardContent>
    <CardFooter class="flex items-center justify-between">
      <div class="product-box-product-price">
        <SharedListingProductPrice
            :product="product"
            class="ml-auto"
            data-testid="product-box-product-price"
        />
      </div>
      <Button v-if="!fromPrice"
              class="hover:cursor-pointer disabled:cursor-not-allowed"
              data-testid="add-to-cart-button"
              :disabled="!product.available"
              @click="addToCartProxy">
        <Plus/>
        {{ translations.product.addToCart }}
        <div v-if="isInCart" class="flex">
          <ShoppingBasket></ShoppingBasket>
          {{ count }}
        </div>
      </Button>
      <Button v-else
              class="hover:cursor-pointer disabled:cursor-not-allowed bg-black hover:bg-black/90"
              :to="buildUrlPrefix(getProductRoute(product), getUrlPrefix())">
        <span data-testid="product-box-product-show-details">Details</span>
      </Button>
    </CardFooter>


    <!-- TODO: ??? -->
    <div class="h-8 mx-4 my-2" v-if="false">
      <p
          v-for="option in product?.options"
          :key="option.id"
          class="items-center line-clamp-2 rounded-md text-xs font-medium text-gray-600 mt-3"
      >
        {{ option.group.name }}:
        <span class="font-bold">{{ option.name }} </span>
      </p>
    </div>
    <!-- end -->
  </Card>
</template>