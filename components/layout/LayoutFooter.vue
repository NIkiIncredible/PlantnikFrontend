<script setup lang="ts">
import {getCategoryRoute, getTranslatedProperty} from "@shopware/helpers";
import {Sun, Moon} from "lucide-vue-next"

const {navigationElements} = useNavigation({type: "footer-navigation"});
const localePath = useLocalePath();
const {formatLink} = useInternationalization(localePath);
const colorMode = useColorMode();
const context = useSessionContext();
const {getPaymentMethods} = useCheckout();

const gridColumns = computed<number>(() =>
    navigationElements.value
        ? Object.keys(navigationElements.value).length
        : 2,
);

const {data: pMethods, status: pMethodsStatus} = useAsyncData("paymentMethods", async () => {
  return (await getPaymentMethods()).value;
})

</script>

<template>
  <footer class="p-4 sm:p-6 mt-10 md:mt-20 border-t-2 border-border bg-card">
    <div class="mx-auto container">
      <div class="sm:flex sm:justify-between">
        <div class="mb-6 md:mb-0">
          <NuxtLinkLocale
              to="/"
              class="logo-container-inner h-full w-fit block mx-auto"
          >
            <img class="min-h-full max-h-full" src="/assets/images/logo/plantnik.svg" alt="">
          </NuxtLinkLocale>

        </div>

        <!-- `grid grid-cols-2 gap-8 md:gap-6 md:grid-cols-${gridColumns}` -->
        <!--        flex-col md:flex-row flex-->
        <div class="grid lg:flex gap-12 sm:grid-cols-2 text-center sm:text-left">

          <div
              v-for="navigationElement in navigationElements"
              :key="navigationElement.id">
            <h3 class="mb-6 text-sm font-semibold uppercase dark:text-white">
              {{ getTranslatedProperty(navigationElement, "name") }}
            </h3>
            <ul class="text-gray-600 dark:text-gray-400" v-if="navigationElement.childCount > 0">
              <li class="mb-4"
                  v-for="navigationChild in navigationElement.children"
                  :key="navigationChild.id">
                <NuxtLink
                    :target="
                    navigationChild.externalLink || navigationChild.linkNewTab
                      ? '_blank'
                      : ''
                  "
                    :to="formatLink(getCategoryRoute(navigationChild))"
                    class="text-base font-normal text-secondary-500 hover:text-secondary-900"
                >
                  {{ getTranslatedProperty(navigationChild, "name") }}
                </NuxtLink>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8"/>
      <div class="sm:flex sm:items-center sm:justify-between">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {{
            new Date().getFullYear()
          }} {{ getTranslatedProperty(context.sessionContext.value?.salesChannel, "name") }}
        </span>
        <div class="flex gap-3 mt-4 sm:justify-center sm:mt-0">
          <ClientOnly>
            <template v-if="pMethodsStatus == 'success'">
              <div v-for="method in pMethods">
                <img :src="method.media?.url"
                     :alt="getTranslatedProperty(method, 'name') + ' Logo'"
                     :aria-label="getTranslatedProperty(method, 'name') + ' Logo'"
                     :title="getTranslatedProperty(method, 'name') + ' Logo'"/>
              </div>
            </template>
            <template v-else>
              <div v-for="n in 5">
                <div class="w-[35px] h-[24px] loader rounded"></div>
              </div>
            </template>

            <template #fallback>
              <div v-for="n in 5">
                <div class="w-[35px] h-[24px] loader rounded"></div>
              </div>
            </template>
          </ClientOnly>
          <!--          <div>-->
          <!--            <img src="/assets/images/payments/GooglePay.svg" alt="GooglePay" />-->
          <!--          </div>-->
          <!--          <div>-->
          <!--            <img src="/assets/images/payments/Maestro.svg" alt="Maestro" />-->
          <!--          </div>-->
          <!--          <div>-->
          <!--            <img src="/assets/images/payments/Mastercard.svg" alt="Mastercard" />-->
          <!--          </div>-->
          <!--          <div>-->
          <!--            <img src="/assets/images/payments/Visa.svg" alt="Visa" />-->
          <!--          </div>-->
          <!--          <div>-->
          <!--            <img src="/assets/images/payments/PayPal.svg" alt="PayPal" />-->
          <!--          </div>-->
          <!--          <div>-->
          <!--            <img src="/assets/images/payments/Sepa.svg" alt="Sepa" />-->
          <!--          </div>-->
          <!--          <div>-->
          <!--            <img src="/assets/images/payments/Pia.svg" alt="Pay in Advanced" />-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </footer>


  <footer class="px-4 sm:px-6 mt-2 lg:mt-8 hidden">
    <menu class="border-t-2 border-secondary-100 flex justify-center">
      <div
          class="py-10 w-full max-w-screen-xl"
          :class="`grid grid-cols-2 md:grid-cols-${gridColumns}`"
      >
        <div class="hidden md:block">
          <NuxtLink :to="formatLink(`/`)">
            <span class="sr-only">Shopware</span>
            <img
                class="h-15 w-auto sm:h-15"
                src="/logo.svg"
                alt="logo of the shop"
            />
          </NuxtLink>
        </div>
        <div
            v-for="navigationElement in navigationElements"
            :key="navigationElement.id"
        >
          <h3 class="mb-5">
            {{ getTranslatedProperty(navigationElement, "name") }}
          </h3>
          <template v-if="navigationElement.childCount > 0">
            <ul class="list-none p-0 mb-5">
              <li
                  v-for="navigationChild in navigationElement.children"
                  :key="navigationChild.id"
                  class="pb-3 md:pb-1"
              >
                <NuxtLink
                    :target="
                    navigationChild.externalLink || navigationChild.linkNewTab
                      ? '_blank'
                      : ''
                  "
                    :to="formatLink(getCategoryRoute(navigationChild))"
                    class="text-base font-normal text-secondary-500 hover:text-secondary-900"
                >
                  {{ getTranslatedProperty(navigationChild, "name") }}
                </NuxtLink>
              </li>
            </ul>
          </template>
        </div>
        <div class="hidden md:block">
          <ul class="list-none">
            <li class="pb-1">
              <a
                  href="mailto:info@shopware.com"
                  class="text-base font-medium text-secondary-500 hover:text-secondary-900"
              >info@shopware.com</a
              >
            </li>
            <li class="pb-1">
              <a
                  href="tel:0080074676260"
                  class="text-base font-medium text-secondary-500 hover:text-secondary-900"
              >
                Worldwide: 00 800 746 7626 0
              </a>
            </li>
          </ul>
          <div class="flex items-center gap-5">
            <LanguageSwitcher/>

            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" size="icon">
                  <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                  <Moon
                      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                  <span class="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="colorMode.preference = 'light'">
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem @click="colorMode.preference = 'dark'">
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem @click="colorMode.preference = 'system'">
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>


        </div>
      </div>
    </menu>
  </footer>
</template>
