<script setup lang=ts>
import {getShippingMethodDeliveryTime, getTranslatedProperty} from "@shopware/helpers";
import {OverlayLoader} from "~/components/ui/loader";
import type {CheckoutStepsProps} from "~/types/CheckoutSteps";

const props = defineProps<CheckoutStepsProps>();

const {
  shippingMethods,
  getShippingMethods,
} = useCheckout();

const {
  refreshSessionContext,
  selectedShippingMethod: shippingMethod,
  setShippingMethod,
  activeShippingAddress,
  setActiveShippingAddress,
} = useSessionContext();

const isLoading = ref(false);

const selectedShippingMethod = computed({
  get(): string {
    return shippingMethod.value?.id || "";
  },
  async set(shippingMethodId: string) {
    isLoading.value = true;
    await setShippingMethod({id: shippingMethodId});
    await refreshShippingMethod();
    isLoading.value = false;
  },
});

const refreshShippingMethod = async () => {
  await getShippingMethods({forceReload: true});
};
</script>

<template>
  <div class="checkout-step-shipping">
    <Card>
      <CardHeader>
        <CardTitle>{{ $t("checkout.shippingMethodLabel") }}</CardTitle>
        <CardDescription>{{ $t("checkout.selectShippingMethod") }}</CardDescription>
      </CardHeader>

      <CardContent>

        <RadioGroup v-model="selectedShippingMethod" :default-value="shippingMethod?.id" orientation="vertical" class="relative">
          <OverlayLoader v-if="isLoading"></OverlayLoader>

          <Label v-for="singleShippingMethod in shippingMethods"
                 :key="singleShippingMethod.id"
                 :for="singleShippingMethod.id"
                 class="flex flex-row items-start gap-x-3 space-y-0 rounded-md border p-4 shadow">
            <div class="flex items-center h-full">
              <RadioGroupItem :id="singleShippingMethod.id" :value="singleShippingMethod.id"/>
            </div>
            <div class="flex justify-between w-full">
              <div class="space-y-1.5">
                <div>
                  <span>{{ getTranslatedProperty(singleShippingMethod, 'name') }}</span>
                  <span v-if="getShippingMethodDeliveryTime(singleShippingMethod)">
                  ({{ getShippingMethodDeliveryTime(singleShippingMethod) }})
                </span>
                </div>
                <div>
                  <p>{{ getTranslatedProperty(singleShippingMethod, 'description') }}</p>
                  <p class="text-muted-foreground">Price :(</p>
                </div>
              </div>
              <div
                  class="rounded-[6px] bg-accent w-[70px] h-[48px] border flex items-center justify-center py-2.5 px-1.5">
                <img loading="lazy"
                     class="object-contain"
                     :src="singleShippingMethod.media.url"
                     alt="payment-image">
              </div>
            </div>
          </Label>
        </RadioGroup>
      </CardContent>
    </Card>

    <slot name="actions" :next="nextStep" :prev="prevStep"></slot>
  </div>
</template>


<style scoped>

</style>