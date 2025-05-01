<script setup lang="ts">
import {ApiClientError} from "@shopware/api-client";
import {getSmallestThumbnailUrl} from "@shopware/helpers";
import type {Schemas} from "#shopware";
import {LoaderCircle, Trash} from "lucide-vue-next";

const miniCartModal = useMiniCartModal();
const localePath = useLocalePath();
const {formatLink} = useInternationalization(localePath);
const {resolveCartError} = useCartErrorParamsResolver();

const props = withDefaults(
    defineProps<{
      cartItem: Schemas["LineItem"];
      maxQty?: number;
    }>(),
    {
      maxQty: 100,
    },
);

const {cartItem} = toRefs(props);

const isLoading = ref(false);
const {getErrorsCodes} = useCartNotification();
const {refreshCart} = useCart();
const {pushError} = useNotifications();
const {t} = useI18n();

const {
  itemOptions,
  removeItem,
  itemTotalPrice,
  itemQuantity,
  isPromotion,
  isRemovable,
  isStackable,
  isDigital,
  changeItemQuantity,
} = useCartItem(cartItem);

const quantity = ref();
syncRefs(itemQuantity, quantity);

const {resolveApiErrors} = useApiErrorsResolver("account_login");

const updateQuantity = async (quantityInput: number | undefined) => {
  if (quantityInput === itemQuantity.value) return;

  isLoading.value = true;

  try {
    const response = await changeItemQuantity(Number(quantityInput));
    // Refresh cart after qty update
    await refreshCart(response);
  } catch (error) {
    if (error instanceof ApiClientError) {
      const errors = resolveApiErrors(error.details.errors);
      for (const error of errors) {
        pushError(error);
      }
    }
  }

  for (const element of getErrorsCodes() ?? []) {
    const {messageKey, params} = resolveCartError(element);
    pushError(t(`errors.${messageKey}`, params as Record<string, unknown>));
  }

  isLoading.value = false;
};
const debounceUpdate = useDebounceFn(updateQuantity, 800);

watch(quantity, () => debounceUpdate(quantity.value));

const removeCartItem = async () => {
  isLoading.value = true;
  await removeItem();
  isLoading.value = false;
};
</script>

<template>
  <Card class="relative">
    <div
        class="absolute top-0 left-0 w-full h-full bg-secondary/70 flex justify-center items-center z-40 rounded-xl cursor-progress"
        v-if="isLoading">
      <LoaderCircle class="animate-spin text-secondary-foreground"/>
    </div>
    <CardContent>
      <div class="grid gap-4">
        <div class="flex gap-4">
          <div
              v-if="!isPromotion"
              class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md"
          >
            <img
                :src="getSmallestThumbnailUrl(cartItem.cover)"
                :alt="`${cartItem.label || cartItem.payload.name || ''} cart item`"
                class="h-full w-full object-cover object-center"
                data-testid="cart-product-image"
            />
          </div>

          <div class="flex flex-1 flex-col text-left">
            <div>
              <div
                  class="flex flex-col lg:flex-row justify-between text-base font-medium text-secondary-900"
              >
                <h3
                    class="text-base cursor-pointer pr-2"
                    data-testid="cart-product-name"
                >
                  <NuxtLinkLocale
                      :to="formatLink(`/detail/${cartItem.id}`)"
                      class="flex items-left text-base font-semibold text-secondary-900 break-words hover:underline"
                      @click="miniCartModal.close"
                  >
                    {{ cartItem.label }}
                    <span
                        v-if="isDigital"
                        data-testid="cart-product-digital-label"
                        class="bg-blue-100 text-blue-800 text-xs mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
                    >{{ $t("cart.digital") }}</span
                    >
                  </NuxtLinkLocale>
                </h3>
                <SharedPrice
                    v-if="itemTotalPrice"
                    :value="itemTotalPrice"
                    data-testid="cart-product-price"
                />
              </div>

              <div class="flex" v-if="itemOptions">
                <div v-for="option in itemOptions" :key="option.group">
                  <p
                      class="mt-1 text-sm text-muted-foreground"
                      data-testid="cart-product-options"
                  >
                    <span class="mr-2">
                      {{ option.option }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
            class="flex flex-1 items-end justify-between text-sm"
            v-if="isStackable"
        >
          <NumberField v-model="quantity"
                       :disabled="isLoading"
                       :min="cartItem.quantityInformation?.minPurchase || 1"
                       :max="cartItem.quantityInformation?.maxPurchase || maxQty"
                       :step="cartItem.quantityInformation?.purchaseSteps || 1"
                       data-testid="cart-product-qty-select"
                       class="w-fit"
                       name="quantity"
                       aria-label="Cart item quantity">
            <NumberFieldContent>
              <NumberFieldDecrement/>
              <NumberFieldInput/>
              <NumberFieldIncrement/>
            </NumberFieldContent>
          </NumberField>
          <Button
              v-if="isRemovable"
              size="icon"
              :variant="'ghost'"
              :disabled="isLoading"
              class="hover:cursor-pointer"
              data-testid="product-remove-button"
              @click="removeCartItem"
          >
            <Trash/>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
