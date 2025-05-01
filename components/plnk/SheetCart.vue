<template>
  <SheetContent v-if="cart">
    <SheetHeader>
      <SheetTitle>{{t('cart.header')}}</SheetTitle>
      <SheetDescription>
        <!-- TODO: change to translation -->
        Make changes to your profile here. Click save when you're done.
      </SheetDescription>
    </SheetHeader>

    <div class="px-4 grid gap-5 overflow-y-auto">
      <ProductItem v-for="item in cart?.lineItems"
                   :key="item.id"
                   :cart-item="item"/>
    </div>

    <SheetFooter>
      <div>
        <div class="columns-2 text-sm">
          <div>Netto</div>
          <div class="text-right">{{getFormattedPrice(cart.price.netPrice)}}</div>
        </div>
        <div class="columns-2 text-sm" v-for="(tax, index) in cart?.price.calculatedTaxes" :key="index + '-tax'">
          <div>Mwst.: {{tax.taxRate}}%</div>
          <div class="text-right">{{getFormattedPrice(tax.tax)}}</div>
        </div>
        <div class="columns-2 text-xl font-semibold">
          <div>Gesamt</div>
          <div class="text-right">{{getFormattedPrice(cart?.price.totalPrice)}}</div>
        </div>
      </div>


      <SheetClose as-child>
        <NuxtLinkLocale to="/checkout" class="w-full">
          <Button class="hover:cursor-pointer w-full" size="lg" type="submit">
            <ShoppingBag class="group-hover:animate-bounce"/> Zur Kasse
          </Button>
        </NuxtLinkLocale>
      </SheetClose>
    </SheetFooter>
  </SheetContent>

  <SheetContent v-else>
    <div class="h-full w-full flex items-center justify-center flex-col gap-10">
      <img src="/assets/images/draw/qa-engineers.svg" class="max-w-3/4">
      <div class="max-w-3/4 text-center flex flex-col gap-4">
        <p>
          Something went wrong, please reload and try again!
        </p>
        <Button class="hover:cursor-pointer" @click="reloadPage">
          Reload page
        </Button>
      </div>
    </div>
  </SheetContent>

</template>

<script setup lang=ts>
import {getTranslatedProperty} from "@shopware/helpers";
import {SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "~/components/ui/sheet";
import {ShoppingBag} from "lucide-vue-next";
import ProductItem from "~/components/checkout/cart/ProductItem.vue";

const {t} = useI18n();
const {cart} = useCart();
const {getFormattedPrice} = usePrice();

function reloadPage() {
  window.location.reload();
}
</script>

<style scoped>

</style>