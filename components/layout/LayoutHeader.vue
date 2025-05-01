<script setup lang="ts">
const { count } = useCart();
const { count: wishlistCount } = useWishlist();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const miniCartModal = useMiniCartModal();

const header = useTemplateRef('header')
const navOffset = ref(0)       // Aktueller Offset (in px)
const navHeight = ref(60)      // Maximale Höhe der Navigation
const lastScroll = ref(0)      // Letzter Scroll-Wert
const topBarHeight = ref(0)

function handleScroll() {
  const currentScroll = window.scrollY || document.documentElement.scrollTop
  const delta = currentScroll - lastScroll.value
  const headerHeight = (navHeight.value + topBarHeight.value);

  if (delta < 0) {
    // Beim Scrollen nach oben: Navigation sofort vollständig anzeigen
    if (currentScroll > headerHeight) {
      navOffset.value = 0
      if (header.value == null) return;
      header.value.style.position = 'sticky';
    }
  } else {
    // Beim Scrollen nach unten: Offset erhöhen, aber nicht über navHeight hinaus
    if (currentScroll < headerHeight) {
      if (header.value == null) return;
      header.value.style.position = 'static';
    } else {
      navOffset.value = Math.min(navOffset.value + delta, navHeight.value)
    }
  }
  lastScroll.value = currentScroll
}

onMounted(() => {
  // Ermittelt die tatsächliche Höhe des Headers (als HTMLElement typisiert)
  const headerEl = document.querySelector('header') as HTMLElement | null
  if (headerEl) {
    navHeight.value = headerEl.offsetHeight || 119
  }

  const topbarEl = document.querySelector('.top-bar') as HTMLElement | null
  if (topbarEl) {
    topBarHeight.value = topbarEl.offsetHeight || 44
  }

  lastScroll.value = window.scrollY || document.documentElement.scrollTop
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <LayoutTopBar/>
  <header id="header" class="top-0 left-0 right-0 bg-background z-50" :style="{ transform: `translateY(-${navOffset}px)` }" ref="header">
    <LayoutNavigation/>
  </header>
</template>

<style>
@import "@/assets/css/tailwind.css";

header {
  @apply top-0 left-0 right-0 z-50;
  transition: transform 0.1s ease-out;
}
</style>
<!--  <header class="relative bg-white" aria-label="top-navigation">-->
<!--    <div class="mx-auto px-4 sm:px-6">-->
<!--      <div-->
<!--        class="flex items-center border-b-2 border-secondary-100 py-6 space-x-4"-->
<!--      >-->
<!--        <div class="flex justify-start items-center min-w-10 lg:min-w-12">-->
<!--          <div class="order-2 lg:order-1 ml-4 lg:ml-0">-->
<!--            <NuxtLink :to="formatLink(`/`)">-->
<!--              <span class="sr-only">Shopware</span>-->
<!--              <img-->
<!--                class="h-10 w-10 lg:h-12 lg:w-12"-->
<!--                src="/logo.svg"-->
<!--                alt="logo of the shop"-->
<!--                width="40px"-->
<!--                height="40px"-->
<!--              />-->
<!--            </NuxtLink>-->
<!--          </div>-->
<!--          <div class="order-1 lg:order-2 flex justify-start items-center">-->
<!--            <LayoutSideMenu />-->
<!--          </div>-->
<!--        </div>-->

<!--        <LayoutTopNavigation />-->
<!--        <div class="flex flex-1"></div>-->

<!--        <div class="hidden md:flex md:min-w-1/4">-->
<!--          <LayoutStoreSearch />-->
<!--        </div>-->

<!--        <div class="flex items-center justify-end">-->
<!--          <AccountMenu />-->
<!--          <div class="flex ml-4 flow-root lg:ml-6">-->
<!--            <NuxtLink-->
<!--              class="group -m-2 p-2 flex items-center relative text-center"-->
<!--              aria-label="wishlist"-->
<!--              data-testid="wishlist-button"-->
<!--              :to="formatLink(`/wishlist`)"-->
<!--            >-->
<!--              <div-->
<!--                class="w-7 h-7 i-carbon-favorite text-secondary-600 hover:text-primary hover:animate-count-infinite hover:animate-heart-beat"-->
<!--              />-->
<!--              <ClientOnly>-->
<!--                <span-->
<!--                  v-if="wishlistCount"-->
<!--                  class="text-3 font-sm text-white absolute bg-red-600 rounded-full min-w-5 min-h-5 top-0 right-0 leading-5"-->
<!--                >-->
<!--                  {{ wishlistCount }}-->
<!--                </span>-->
<!--              </ClientOnly>-->
<!--            </NuxtLink>-->
<!--          </div>-->
<!--          &ndash;&gt;-->
<!--  -->
<!--          &lt;!&ndash; Cart &ndash;&gt;-->
<!--          <div class="flex ml-4 flow-root lg:ml-6">-->
<!--            <button-->
<!--              class="group bg-transparent -m-2 p-2 flex items-center relative"-->
<!--              aria-label="Mini cart"-->
<!--              data-testid="cart-button"-->
<!--              @click="miniCartModal.open"-->
<!--            >-->
<!--              &lt;!&ndash; Heroicon name: outline/shopping-bag &ndash;&gt;-->
<!--              <div-->
<!--                class="w-7 h-7 i-carbon-shopping-bag text-secondary-600 hover:text-primary"-->
<!--              />-->
<!--              <span-->
<!--                v-if="count > 0"-->
<!--                class="text-3 font-sm text-white absolute bg-primary-600 rounded-full min-w-5 min-h-5 top-0 right-0 leading-5"-->
<!--              >-->
<!--                {{ count || "" }}-->
<!--              </span>-->
<!--              <span class="sr-only"-->
<!--                >{{ $t("cart.itemsInCart") }}, {{ $t("cart.viewCart") }}</span-->
<!--              >-->
<!--            </button>-->
<!--          </div>-->
<!--          <CheckoutSideCart :controller="miniCartModal" />-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </header>-->
