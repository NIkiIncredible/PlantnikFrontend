<template>
  <div class="navigation-wrapper shadow-lg border-b-3 border-b-primary">
    <div class="navigation container mx-auto pt-3">
      <div class="navigation-upper columns-2 md:columns-3">
        <div class="nav-upper-col navigation-logo-container h-[40px]">
          <NuxtLinkLocale
              to="/"
              class="logo-container-inner h-full w-fit block"
          >
            <img class="min-h-full max-h-full" src="/assets/images/logo/plantnik.svg" alt="">
          </NuxtLinkLocale>
        </div>

        <!-- Search field -->
        <div class="nav-upper-col m-auto navigation-search hidden md:block">
          <Search class="m-auto"></Search>
        </div>


        <!-- Actions -->
        <div class="nav-upper-col navigation-actions flex justify-end items-center gap-5">

          <!-- Wishlist -->
          <div class="flex navigation-actions-item">
            <NuxtLinkLocale
                class="group -m-2 p-2 flex items-center relative text-center
                hover:text-primary hover:cursor-pointer overflow-hidden"
                aria-label="wishlist"
                data-testid="wishlist-button"
                :to="formatLink(`/wishlist`)"
            >
              <Heart/>
              <ClientOnly>
                <span
                    v-if="wishlistCount"
                    class="text-3 font-sm text-white absolute bg-red-600 rounded-full min-w-5 min-h-5 top-0 right-0 leading-5"
                >
                  {{ wishlistCount }}
                </span>
              </ClientOnly>
            </NuxtLinkLocale>
          </div>

          <!-- User -->
          <div class="navigation-actions-item relative">
            <DropdownMenu class="relative">
              <DropdownMenuTrigger  as-child>
                <div class="flex items-center h-full hover:text-primary hover:cursor-pointer relative">
                  <User :size="24"/>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>


          <!-- Cart -->
          <div class="flex navigation-actions-item">
            <Sheet>
              <SheetTrigger as-child>
                <button
                    class="-m-2 p-2 flex items-center gap-1 hover:cursor-pointer group"
                    aria-label="Mini cart"
                    data-testid="cart-button"
                >
                  <div class="h-9 w-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center
                  group-hover:shadow-md shadow-primary/50 transition-shadow duration-300">
                    <ShoppingBasket></ShoppingBasket>
                  </div>

                  <span class="font-medium text-base">
                    {{ getFormattedPrice(subtotal) }}
                  </span>
                  <span
                      v-if="count > 0"
                      class="text-3 font-sm text-white absolute bg-primary-600 rounded-full min-w-5 min-h-5 top-0 right-0 leading-5"
                  >
                    {{ count || "" }}
                  </span>
                  <span class="sr-only"
                  >{{ $t("cart.itemsInCart") }}, {{ $t("cart.viewCart") }}</span
                  >
                </button>
              </SheetTrigger>

              <PlnkSheetCart/>

            </Sheet>
          </div>

        </div>
      </div>

      <div class="navigation-lower navigation-menu container m-auto py-2">
        <div class="-ml-4">
          <LayoutNavigationMenu/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {Heart, ShoppingBasket, User, ShoppingBag} from "lucide-vue-next";
import {getTranslatedProperty} from "@shopware/helpers";

const {count} = useCart();
const {count: wishlistCount} = useWishlist();
const {subtotal} = useCart();

const {locale} = useI18n();
const localePath = useLocalePath();
const {formatLink} = useInternationalization(localePath);
const {getFormattedPrice} = usePrice();
const {cart} = useCart();


</script>

<style scoped>
.navigation-actions-item {
  @apply relative;
}
</style>