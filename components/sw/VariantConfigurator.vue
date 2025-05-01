<script setup lang="ts">
import {useCmsTranslations} from "@shopware/composables";
import {buildUrlPrefix, getProductRoute, getTranslatedProperty} from "@shopware/helpers";
import {defu} from "defu";
import type {ComputedRef} from "vue";
import {computed, ref, unref} from "vue";
import {useRouter} from "vue-router";
import {useProductConfigurator, useUrlResolver} from "#imports";
import type {Schemas} from "#shopware";

const {getUrlPrefix} = useUrlResolver();

const prefix = getUrlPrefix();

const props = withDefaults(
    defineProps<{
      allowRedirect?: boolean;
    }>(),
    {
      allowRedirect: true,
    },
);

type Translations = {
  product: {
    chooseA: string;
  };
};

let translations: Translations = {
  product: {
    chooseA: "Choose a",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const emit =
    defineEmits<
        (e: "change", selected: Partial<Schemas["Product"]> | undefined) => void
    >();
const isLoading = ref<boolean>();
const router = useRouter();
const {
  handleChange,
  getOptionGroups,
  getSelectedOptions,
  findVariantForSelectedOptions,
} = useProductConfigurator();

const selectedOptions: ComputedRef = computed(() =>
    Object.values(unref(getSelectedOptions)),
);
const isOptionSelected = (optionId: string) =>
    Object.values(getSelectedOptions.value).includes(optionId);

const onHandleChange = async () => {
  isLoading.value = true;
  const variantFound = await findVariantForSelectedOptions();
  const selectedOptionsVariantPath = buildUrlPrefix(
      getProductRoute(variantFound),
      prefix,
  );
  if (props.allowRedirect && selectedOptionsVariantPath) {
    try {
      router.push(selectedOptionsVariantPath);
    } catch {
      console.error("incorrect URL", selectedOptionsVariantPath);
    }
  } else {
    emit("change", variantFound);
  }
  isLoading.value = false;
};
</script>
<style>
.bbb {
  @apply backdrop-grayscale-75;
}
</style>

<template>
  <!-- Loading state -->
  <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center z-10 bg-white/75"
  >
    <div
        data-testid="loading"
        class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"
    />
  </div>

  <!-- Loaded configurator -->
  <div
      v-for="optionGroup in getOptionGroups"
      :key="optionGroup.id"
      class="flex flex-col gap-2"
  >
    <!-- Label -->
    <span class="font-medium">{{ optionGroup.name }}</span>

    <fieldset class="flex-1">
      <legend class="sr-only">
        {{ translations.product.chooseA }} {{ optionGroup.name }}
      </legend>

      <!-- Color configuration -->
      <div class="flex gap-2">
        <template v-if="optionGroup.displayType == 'color'">
          <ProductOptionColor v-for="option in optionGroup.options"
                              :key="option.id"
                              :option="option"
                              :is-active="isOptionSelected(option.id)"
                              :title="getTranslatedProperty(option, 'name')"
                              @click="handleChange(optionGroup.translated.name, option.id, onHandleChange)"/>
        </template>

        <!-- Text configuration -->
        <template v-else>
          <Button v-for="option in optionGroup.options"
                  :key="option.id"
                  data-testid="product-variant"
                  :variant="isOptionSelected(option.id) ? 'default' : 'outline'"
                  :title="getTranslatedProperty(option, 'name')"
                  size="lg"
                  class="hover:cursor-pointer"
                  @click="handleChange(optionGroup.translated.name, option.id, onHandleChange)"
          >{{ option.translated.name }}
          </Button>
        </template>
      </div>
    </fieldset>
  </div>
</template>
