<script setup lang="ts">
import type {CmsElementBuyBox} from "@shopware/composables";
import {useCmsTranslations} from "@shopware/composables";
import {defu} from "defu";
import {computed} from "vue";
import {useCmsElementConfig, usePrice, useProduct, useProductPrice, useSessionContext,} from "#imports";
import {getTranslatedProperty} from "@shopware/helpers";
import {Truck} from "lucide-vue-next"

const props = defineProps<{
  content: CmsElementBuyBox;
}>();

type Translations = {
  product: {
    previously: string;
    amount: string;
    price: {
      [key: string]: string;
    };
    to: string;
    from: string;
    content: string;
    pricesIncl: string;
    pricesExcl: string;
    deliveryTime: string;
    days: string;
    noAvailable: string;
    productNumber: string;
  };
};

let translations: Translations = {
  product: {
    previously: "Previously",
    amount: "Amount",
    price: {
      label: "Price",
      to: "To",
      from: "From",
    },
    to: "To",
    from: "From",
    content: "Content",
    pricesIncl: "Prices incl. VAT plus shipping costs",
    pricesExcl: "Prices excl. VAT plus shipping costs",
    deliveryTime: "Available, delivery time",
    days: "days",
    noAvailable: "No longer available",
    productNumber: "Product number",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const {getConfigValue} = useCmsElementConfig(props.content);
const alignment = computed(() => getConfigValue("alignment"));

const {taxState, currency} = useSessionContext();

const {product, changeVariant} = useProduct(
    props.content.data.product,
    props.content.data.configuratorSettings || [],
);

const {unitPrice, price, tierPrices, isListPrice} = useProductPrice(product);
const regulationPrice = computed(() => price.value?.regulationPrice?.price);
const {getFormattedPrice} = usePrice();

const referencePrice = computed(
    () => product.value?.calculatedPrice?.referencePrice,
);
const productNumber = computed(() => product.value?.productNumber);
const purchaseUnit = computed(() => product.value?.purchaseUnit);
const unitName = computed(() => product.value?.unit?.name);
const availableStock = computed(() => product.value?.availableStock ?? 0);
const minPurchase = computed(() => product.value?.minPurchase ?? 0);
const deliveryTime = computed(() => product.value?.deliveryTime);
const restockTime = computed(() => product.value?.restockTime);
</script>
<template>
  <div
      v-if="product"
      class="h-full flex flex-col cms-element-buy-box"
  >

    <div class="flex flex-col product-title-container">

      <h1 class="text-3xl font-bold mb-2">{{ getTranslatedProperty(product, 'name') }}</h1>
      <div class="text-2xl flex items-baseline gap-4 mb-6">
        <template v-if="isListPrice">
          <SharedPrice :value="price?.listPrice?.price" class="font-bold">
            <template #afterPrice>
              <small class="line-through text-destructive font-normal">
                <SharedPrice :value="unitPrice"/>
              </small>
            </template>
          </SharedPrice>
        </template>
        <template v-else>
          <SharedPrice :value="unitPrice"/>
        </template>

        <!-- Show discount -->
        <div class="text-green-500 hidden">
          <span class="text-sm font-medium text-green-600">Save 25%</span>
        </div>
      </div>

      <!-- Show small description -->
      <div class="text-muted-foreground mb-6">
        {{ getTranslatedProperty(product, 'metaDescription') }}
      </div>

      <!-- Delivery times -->
      <div class="flex items-center text-sm gap-1 mb-4">
        <div :class="{
              'h-2 w-2 rounded-full': true,
              'bg-green-500': availableStock >= minPurchase && deliveryTime,
              'bg-yellow-500': availableStock < minPurchase && deliveryTime && restockTime,
              'bg-red-600': ((availableStock < minPurchase) && (restockTime == null)),
            }"></div>
        <div>
                <span v-if="availableStock >= minPurchase && deliveryTime">
                {{ translations.product.deliveryTime }} {{ deliveryTime?.name }}
              </span>
          <span v-else-if="availableStock < minPurchase && deliveryTime && restockTime">
                  {{ translations.product.deliveryTime }} {{ restockTime }}
                  {{ translations.product.days }} {{ deliveryTime?.name }}
                </span>
          <span v-else>{{ translations.product.noAvailable }}</span>
        </div>
      </div>

      <!-- Features or something -->
      <div class="flex gap-4 mb-8">
        <div class="flex items-center gap-2 text-sm">
          <Truck class="w-4 h-4"></Truck>
          <span>Shipping</span>
        </div>
      </div>

      <!-- Product Configurator -->
      <div class="space-y-6 pt-6 border-t">
        <SwVariantConfigurator @change="changeVariant"/>
      </div>

      <!-- Product Actions -->
      <div class="mt-8">
          <SwProductAddToCart :product="product"/>
      </div>

      <!-- Information -->
      <div class="mt-3 product-detail-ordernumber-container text-sm">
          <span class="font-bold">
            {{ translations.product.productNumber }}:
          </span>
        <span>
            {{ productNumber }}
          </span>
      </div>
    </div>


    <!-- old -->
<!--    <div class="hidden">-->
<!--      <div class="mt-10 product-price-container text-3xl flex">-->
<!--        <div v-if="tierPrices.length <= 1">-->
<!--          <div class="flex items-center gap-5">-->
<!--            <div>-->
<!--              <template v-if="isListPrice">-->
<!--                <SharedPrice :value="price?.listPrice?.price">-->
<!--                  <template #afterPrice>-->
<!--                    <small class="line-through text-destructive">-->
<!--                      <SharedPrice :value="unitPrice"/>-->
<!--                    </small>-->
<!--                  </template>-->
<!--                </SharedPrice>-->
<!--              </template>-->
<!--              <template v-else>-->
<!--                <SharedPrice :value="unitPrice"/>-->
<!--              </template>-->
<!--            </div>-->
<!--          </div>-->


<!--          <template hidden="">-->
<!--            <SharedPrice-->
<!--                v-if="isListPrice"-->
<!--                class="text-1xl text-secondary-900 basis-2/6 justify-start line-through"-->
<!--                :value="price?.listPrice?.price"-->
<!--            />-->
<!--            <SharedPrice-->
<!--                v-if="unitPrice"-->
<!--                class="text-3xl text-secondary-900 basis-2/6 justify-start"-->
<!--                :class="{'text-red': isListPrice,}"-->
<!--                :value="unitPrice"/>-->
<!--          </template>-->


<!--          <div v-if="regulationPrice" class="text-xs flex text-secondary-500">-->
<!--            {{ translations.product.previously }}-->
<!--            <SharedPrice class="ml-1" :value="regulationPrice"/>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div v-if="false">-->
<!--        <table class="border-collapse table-auto w-full text-sm mb-8">-->
<!--          <thead>-->
<!--          <tr>-->
<!--            <th-->
<!--                class="border-b dark:border-secondary-600 font-medium p-4 pl-8 pt-0 pb-3 text-secondary-600 dark:text-secondary-200 text-left"-->
<!--            >-->
<!--              {{ translations.product.amount }}-->
<!--            </th>-->

<!--            <th-->
<!--                class="border-b dark:border-secondary-600 font-medium p-4 pr-8 pt-0 pb-3 text-secondary-600 dark:text-secondary-200 text-left"-->
<!--            >-->
<!--              {{ translations.product.price.label }}-->
<!--            </th>-->
<!--          </tr>-->
<!--          </thead>-->
<!--          <tbody class="bg-white dark:bg-secondary-800">-->
<!--          <tr v-for="(tierPrice, index) in tierPrices" :key="tierPrice.label">-->
<!--            <td-->
<!--                class="border-b border-secondary-100 dark:border-secondary-700 p-4 pl-8 font-medium text-secondary-500 dark:text-secondary-400"-->
<!--            >-->
<!--                <span v-if="index < tierPrices.length - 1">{{-->
<!--                    translations.product.to-->
<!--                  }}</span-->
<!--                ><span v-else>{{ translations.product.from }}</span>-->
<!--              {{ tierPrice.quantity }}-->
<!--            </td>-->
<!--            <td-->
<!--                class="border-b border-secondary-100 dark:border-secondary-700 p-4 pr-8 font-medium text-current-500 dark:text-secondary-400"-->
<!--            >-->
<!--              {{ getFormattedPrice(tierPrice.unitPrice) }}-->
<!--            </td>-->
<!--          </tr>-->
<!--          </tbody>-->
<!--        </table>-->
<!--      </div>-->
<!--      <div v-if="purchaseUnit && unitName" class="mt-1">-->
<!--        <span class="font-light"> {{ translations.product.content }}: </span>-->
<!--        <span class="font-light"> {{ purchaseUnit }} {{ unitName }} </span>-->
<!--        <span v-if="referencePrice" class="font-light">-->
<!--          {{ currency?.symbol }} {{ referencePrice?.price }} / /-->
<!--          {{ referencePrice?.referenceUnit }} {{ referencePrice?.unitName }}-->
<!--        </span>-->
<!--      </div>-->
<!--      <span class="text-indigo-600">-->
<!--        <template v-if="taxState === 'gross'">-->
<!--          {{ translations.product.pricesIncl }}-->
<!--        </template>-->
<!--        <template v-else> {{ translations.product.pricesExcl }} </template>-->
<!--      </span>-->
<!--    </div>-->

  </div>
</template>