<script setup lang=ts>
import * as z from 'zod'
import {getTranslatedProperty} from "@shopware/helpers";
import {computed} from 'vue'
import type {CheckoutStepsProps} from "~/types/CheckoutSteps";
import type {operations} from "#shopware";

// State
const localePath = useLocalePath();
const props = defineProps<CheckoutStepsProps>();
const isLoading = ref(false);
const formErrors = ref({});
//TODO: Ask user if he wants to create a account
const form = ref<operations["register post /account/register"]["body"]>({
  salutationId: '',
  firstName: '',
  lastName: '',
  email: '',
  telephone: '',
  guest: true,
  billingAddress: {
    street: '',
    additionalAddressLine1: '',
    zipcode: '',
    city: '',
    countryId: '',
    stateId: '',
    country: '',
  },
  storefrontUrl: 'https://plantnik.de',
  acceptedDataProtection: true
})

// Composable
const {t} = useI18n();
const {push} = useRouter();
const {formatLink} = useInternationalization(localePath);
const {register, logout, isLoggedIn, isGuestSession, user} = useUser();
const {getSalutations} = useSalutations();
const {getCountries, getStatesForCountry} = useCountries();
const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value);
const {
  activeShippingAddress,
  setActiveShippingAddress,
  sessionContext
} = useSessionContext();

// Computed
const salutationsEnum = computed(() => {
  if (!getSalutations.value?.length) return [''] as const
  return getSalutations.value.map(salutation => salutation.id.toString())
})

const addressFormSchema = computed(() => z.object({
  salutationId: z.enum(salutationsEnum.value as [string, ...string[]]),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  telephone: z.string().optional(),
  billingAddress: z.object({
    street: z.string().min(3),
    additionalAddressLine1: z.string().optional(),
    zipcode: z.string().min(3),
    city: z.string().min(3),
    countryId: z.string().min(3),
  })
}))

const selectedShippingAddress = computed({
  get(): string {
    return activeShippingAddress.value?.id || "";
  },
  async set(shippingAddressId: string) {
    isLoading.value = true;
    await setActiveShippingAddress({id: shippingAddressId});
    await Promise.allSettled([
      !isVirtualCart.value ? refreshShippingMethod() : null,
      refreshPaymentMethod(),
    ]);

    // if (shippingAddressId === selectedBillingAddress.value)
    //   customShipping.value = false;
    isLoading.value = false;
  },
});

// Methods
const validateForm = () => {
  try {
    addressFormSchema.value.parse(form.value)
    return true;
  } catch (e) {
    formErrors.value = e.errors;
  }
  return false;
}

const validateFormAndSubmit = async () => {
  if (validateForm()) {
    await register(form.value)
    props.nextStep()
  }
}

async function invokeLogout() {
  try {
    await logout();
  } finally {
    await push(formatLink("/"));
  }
}
</script>

<template>
  <div class="checkout-address-form">
    <Card>
      <CardHeader>
        <CardTitle>Persönliche Informationen</CardTitle>
        <CardDescription>
          Geben Sie eine permanente Adresse an, an der Sie Post erhalten können.
        </CardDescription>
      </CardHeader>
      <CardContent>

        <!-- When no address is available show form -->
        <form class="grid space-y-20" autocomplete="on" v-if="!isUserSession">
          <div class="checkout-form-section grid md:grid-cols-2 gap-5">
            <div class="space-y-2">
              <Label for="salutation">{{ t("form.salutation") }} <span class="text-red-400">*</span></Label>
              <Select v-model="form.salutationId" autocomplete="honorific-prefix">
                <SelectTrigger class="w-full">
                  <SelectValue :placeholder="t('form.chooseSalutation')"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="salutation in getSalutations"
                              :key="salutation.id"
                              :value="salutation.id">
                    {{ getTranslatedProperty(salutation, 'displayName') }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p></p>
            </div>

            <div class="space-y-2 md:col-start-1">
              <Label for="firstName">{{ t("form.firstName") }}</Label>
              <Input v-model="form.firstName"
                     id="firstName"
                     :placeholder="t('form.firstNamePlaceholder')"
                     autocomplete="given-name"
                     required/>
            </div>

            <div class="space-y-2">
              <Label for="lastName">{{ t("form.lastName") }}</Label>
              <Input v-model="form.lastName"
                     id="lastName"
                     :placeholder="t('form.lastNamePlaceholder')"
                     autocomplete="family-name"
                     required/>
            </div>
          </div>

          <div class="checkout-form-section grid md:grid-cols-2 gap-5">
            <div class="space-y-2 md:col-span-2">
              <Label for="address1">{{ t("form.streetAddress") }}</Label>
              <Input v-model="form.billingAddress.street"
                     id="address1"
                     :placeholder="t('form.streetPlaceholder')"
                     autocomplete="address-line1"
                     required/>
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label for="address2">{{ t("form.street2Address") }}</Label>
              <Input v-model="form.billingAddress.additionalAddressLine1"
                     id="address2"
                     :placeholder="t('form.street2Placeholder')"
                     autocomplete="address-line2"/>
            </div>

            <div class="space-y-2">
              <Label for="zipcode">{{ t("form.postalCode") }}</Label>
              <Input v-model="form.billingAddress.zipcode"
                     id="zipcode"
                     :placeholder="t('form.postalCodePlaceholder')"
                     autocomplete="postal-code"
                     required/>
            </div>

            <div class="space-y-2">
              <Label for="city">{{ t("form.city") }}</Label>
              <Input v-model="form.billingAddress.city"
                     id="city"
                     :placeholder="t('form.cityPlaceholder')"
                     autocomplete="address-level2"
                     required/>
            </div>
            <div class="space-y-2">
              <Label for="country">{{ t("form.country") }} <span class="text-red-400">*</span></Label>

              <Select v-model="form.billingAddress.countryId" autocomplete="country">
                <SelectTrigger class="w-full">
                  <SelectValue :placeholder="t('form.chooseCountry')"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="c in getCountries"
                              :key="c.id"
                              :value="c.id">
                    {{ getTranslatedProperty(c, 'name') }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="checkout-form-section grid md:grid-cols-2 gap-5">
            <div class="space-y-2">
              <Label for="email">{{ t("form.email") }}</Label>
              <Input v-model="form.email"
                     id="email"
                     type="email"
                     :placeholder="t('form.emailPlaceholder')"
                     autocomplete="email"
                     required/>
            </div>

            <div class="space-y-2 form-element">
              <Label for="phone">{{ t("form.telephone") }}</Label>
              <Input v-model="form.telephone"
                     id="phone"
                     type="tel"
                     autocomplete="tel"
                     :placeholder="t('form.telephonePlaceholder')"
              />
            </div>
          </div>
        </form>

        <!-- -->
        <div v-else>
          {{ t("checkout.loggedInAs") }} {{ user?.firstName }}.
          <span
              v-if="isGuestSession"
              class="bg-secondary text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-secondary dark:text-secondary-300"
          >{{ t("checkout.guest") }}.</span
          >
          <a
              href="#"
              class="text-primary font-bold hover:text-dark"
              data-testid="checkout-logout"
              aria-label="click here to log out"
              @click="invokeLogout"
          >{{ t("checkout.logOut") }}</a
          >.

<!--          <CheckoutCustomerBaseInfo-->
<!--              v-if="editPersonalInfo"-->
<!--              class="mt-4"-->
<!--              :customerData="{-->
<!--                  firstName: user?.firstName,-->
<!--                  lastName: user?.lastName,-->
<!--                  salutationId: user?.salutationId,-->
<!--                }"-->
<!--              @update="handleChangeBaseInfo"-->
<!--              @cancel="editPersonalInfo = false"-->
<!--          />-->
        </div>

      </CardContent>
    </Card>
    <slot name="actions" :next="validateFormAndSubmit" :prev="prevStep"></slot>
  </div>
</template>

<style scoped>
div:has(input:required) > label::after {
  content: "*"; /* ein geschütztes Leerzeichen + Stern */
  color: var(--destructive);
}
</style>