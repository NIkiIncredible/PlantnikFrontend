<script setup lang=ts>
import {OverlayLoader} from "~/components/ui/loader";
import {getTranslatedProperty} from "@shopware/helpers";
import type {CheckoutStepsProps} from "~/types/CheckoutSteps";

const props = defineProps<CheckoutStepsProps>();
const {
  paymentMethods,
  getPaymentMethods,
} = useCheckout();
const {
  selectedPaymentMethod: paymentMethod,
  setPaymentMethod,
} = useSessionContext();
const isLoading = ref(false);

const refreshPaymentMethod = async () => {
  await getPaymentMethods({forceReload: true});
};
const selectedPaymentMethod = computed({
  get(): string {
    return paymentMethod.value?.id || "";
  },
  async set(paymentMethodId: string) {
    isLoading.value = true;
    await setPaymentMethod({id: paymentMethodId});
    await refreshPaymentMethod(),
        isLoading.value = false;
  },
});
</script>

<template>
  <div class="checkout-set-payment">
    <Card>
      <CardHeader>
        <CardTitle>
          {{ $t("checkout.paymentMethodLabel") }}
        </CardTitle>
        <CardDescription>
          {{ $t("checkout.selectPaymentMethod") }}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RadioGroup v-model="selectedPaymentMethod"
                    :default-value="paymentMethod?.id"
                    orientation="vertical"
                    class="relative">
          <OverlayLoader v-if="isLoading"></OverlayLoader>
          <Label v-for="method in paymentMethods"
                 :key="method.id"
                 :for="method.id"
                 class="flex flex-row items-start gap-x-3 space-y-0 rounded-md border p-4 shadow">
            <div class="flex items-center h-full">
              <RadioGroupItem :id="method.id" :value="method.id"/>
            </div>
            <div class="flex justify-between w-full">
              <div class="space-y-1.5">
                <div class="text-base">{{ getTranslatedProperty(method, 'name') }}</div>
                <div class="text-muted-foreground text-sm">{{ getTranslatedProperty(method, 'description') }}</div>
              </div>
              <div class="h-[48px]">
                <img loading="lazy"
                     class="object-contain h-full"
                     :src="method.media.url"
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