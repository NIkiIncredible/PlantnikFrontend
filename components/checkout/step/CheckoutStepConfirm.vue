<script setup lang="ts">
import type {CheckoutStepsProps} from "~/types/CheckoutSteps";
import {getTranslatedProperty} from "@shopware/helpers";
import {ShieldQuestion} from "lucide-vue-next";

const props = defineProps<CheckoutStepsProps>();
const {t} = useI18n();

const {
  shippingAddress,
  paymentMethods,
  getPaymentMethods,
  selectedShippingMethod: shippingMethod,
  selectedPaymentMethod: paymentMethod,
} = useCheckout();

const {
  refreshSessionContext,
  setShippingMethod,
  setPaymentMethod,
  activeShippingAddress,
  setActiveShippingAddress,
  activeBillingAddress,
  setActiveBillingAddress,
} = useSessionContext();

const {customerAddresses, loadCustomerAddresses} = useAddress();

// State
const isLoading = ref(false);
const customShipping = ref(false);

// Methods
const selectedBillingAddress = computed({
  get(): string {
    return activeBillingAddress.value?.id || "";
  },
  async set(billingAddressId: string) {
    isLoading.value = true;
    await setActiveBillingAddress({id: billingAddressId});
    await Promise.allSettled([
      !props.isVirtualCart.value ? props.refreshShippingMethod() : null,
      props.refreshPaymentMethod(),
    ]);
    if (billingAddressId === props.selectedShippingAddress.value)
      customShipping.value = false;
    isLoading.value = false;
  },
});
</script>
<template>
  <div class="checkout-step-confirm">
    <Card>
      <CardHeader>
        <!-- Add translation for card infos -->
        <CardTitle>{{t('checkout.checkOrderDetailsLabel')}}</CardTitle>
        <CardDescription>{{t('checkout.checkOrderDetails')}}</CardDescription>
      </CardHeader>
      <CardContent class="grid space-y-5">
        <div class="text-styled grid grid-cols-2">
          <div class="space-y-5">
            <h3>{{t('checkout.shippingAddressLabel')}}</h3>
            <div class="grid text-styled" v-if="activeShippingAddress != null">
              <span>{{ activeShippingAddress.firstName }} {{ activeShippingAddress.lastName }}</span>
              <span>{{ activeShippingAddress.street }}</span>
              <span>{{ activeShippingAddress.additionalAddressLine1 }}</span>
              <span>{{ activeShippingAddress.zipcode }} {{ activeShippingAddress.city }}</span>
              <span>{{ getTranslatedProperty(activeShippingAddress.country, 'name') }}</span>
            </div>
            <div v-else>
              <Alert variant="destructive">
                <ShieldQuestion class="h-4 w-4"/>
                <AlertTitle>{{t('checkout.messages.checkoutNotFoundLabel')}}</AlertTitle>
                <AlertDescription>
                  {{t('checkout.messages.checkoutNotFound', [t('checkout.shippingAddressLabel')])}}
                </AlertDescription>
              </Alert>
            </div>
          </div>
          <div class="space-y-5">
            <h3>{{t('checkout.billingAddressLabel')}}</h3>
            <div class="grid text-styled" v-if="activeBillingAddress != null">
              <span>{{ activeBillingAddress.firstName }} {{ activeBillingAddress.lastName }}</span>
              <span>{{ activeBillingAddress.street }}</span>
              <span>{{ activeBillingAddress.additionalAddressLine1 }}</span>
              <span>{{ activeBillingAddress.zipcode }} {{ activeBillingAddress.city }}</span>
              <span>{{ getTranslatedProperty(activeBillingAddress.country, 'name') }}</span>
            </div>
            <div v-else>
              <Alert variant="destructive">
                <ShieldQuestion class="h-4 w-4"/>
                <AlertTitle>{{t('checkout.messages.checkoutNotFoundLabel')}}</AlertTitle>
                <AlertDescription>
                  {{t('checkout.messages.checkoutNotFound', [t('checkout.billingAddressLabel')])}}
                </AlertDescription>
              </Alert>
            </div>
          </div>
          <div class="space-y-5">
            <h3>{{t('checkout.shippingMethodLabel')}}</h3>
            <div class="flex gap-5" v-if="shippingMethod != null">
              <div>
                <div
                    class="rounded-[6px] bg-accent w-[70px] h-[48px] border flex items-center justify-center py-2.5 px-1.5">
                  <img loading="lazy"
                       class="object-contain"
                       :src="shippingMethod.media?.url"
                       :alt="shippingMethod.name + '-logo'">
                </div>
              </div>
              <div class="grid">
                <span class="font-semibold">{{ getTranslatedProperty(shippingMethod, 'name') }}</span>
                <span class="text-sm">{{ getTranslatedProperty(shippingMethod.deliveryTime, 'name') }}</span>
              </div>
            </div>
            <div v-else>
              <Alert variant="destructive">
                <ShieldQuestion class="h-4 w-4"/>
                <AlertTitle>{{t('checkout.messages.checkoutNotFoundLabel')}}</AlertTitle>
                <AlertDescription>
                  {{t('checkout.messages.checkoutNotFound', [t('checkout.shippingMethodLabel')])}}
                </AlertDescription>
              </Alert>
            </div>
          </div>
          <div class="space-y-5">
            <h3>{{t('checkout.paymentMethodLabel')}}</h3>
            <div class="flex gap-5" v-if="paymentMethod != null">
              <div>
                <img loading="lazy"
                     class="object-contain w-[70px] h-[48px]"
                     :src="paymentMethod.media?.url"
                     :alt="paymentMethod.name + '-logo'">
              </div>
              <div class="grid">
                <span class="font-semibold">{{ getTranslatedProperty(paymentMethod, 'name') }}</span>
                <span class="text-sm">{{ getTranslatedProperty(paymentMethod, 'description') }}</span>
              </div>
            </div>
            <div v-else>
              <Alert variant="destructive">
                <ShieldQuestion class="h-4 w-4"/>
                <AlertTitle>{{t('checkout.messages.checkoutNotFoundLabel')}}</AlertTitle>
                <AlertDescription>
                  {{t('checkout.messages.checkoutNotFound', [t('checkout.paymentMethodLabel')])}}
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>

        <div class="space-y-5">
          <h3 class="h3">
            {{ t("checkout.termsAdnConditions") }}
          </h3>
          <div class="items-top flex gap-x-2">
            <Checkbox id="terms1" />
            <div class="grid gap-1.5 leading-none">
              <label
                  for="terms1"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {{t("checkout.termsAdnConditionsLabel")}}
              </label>
              <p class="text-sm text-muted-foreground">
                {{t("checkout.termsAdnConditionsDescription")}}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <slot name="actions" :next="nextStep" :prev="prevStep"></slot>
  </div>
</template>