<script
    setup
    lang="ts"
    generic="
    ListingFilter extends {
      code: string;
      label: string;
      name: string;
      options: Array<Schemas['PropertyGroupOption'] & { count: number }>;
      entities: Array<Schemas['ProductManufacturer'] & { count: number }>;
    }
  "
>
import {getTranslatedProperty} from "@shopware/helpers";
import {inject} from "vue";
import type {Schemas} from "#shopware";

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: Schemas["ProductListingResult"]["currentFilters"];
}>();

const emits =
    defineEmits<
        (e: "select-value", value: { code: string; value: unknown }) => void
    >();
const selectedOptionIds = inject<string[]>("selectedOptionIds");
</script>

<template>
  <AccordionTrigger>
    {{ filter.label }}
  </AccordionTrigger>

  <AccordionContent>
    <div
        v-if="(!filter.hasOwnProperty('displayType')) || filter.displayType == 'text'"
        class="grid gap-2.5"
    >
      <div class="flex items-center space-x-2"
           v-for="option in props.filter.options || props.filter.entities"
           :key="`${option.id}-${selectedOptionIds?.includes(option.id)}`">

        <Checkbox :id="`filter-mobile-${props.filter.code}-${option.id}`"
                  :model-value="selectedOptionIds?.includes(option.id)"
                  :checked="selectedOptionIds?.includes(option.id)"
                  :name="props.filter.name"
                  :value="option.name"
                  :aria-label="`${option.name} filter`"
                  @update:model-value="
                      emits('select-value', {
                        code: props.filter.code,
                        value: option.id,
                      })"
        />
        <label
            :for="`filter-mobile-${props.filter.code}-${option.id}`"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {{ getTranslatedProperty(option, "name") }}{{ option.count ? " (" + option.count + ")" : "" }}
        </label>

      </div>
    </div>
    <div v-if="filter.displayType == 'color'"
         class="flex flex-wrap gap-3">
      <div v-for="option in props.filter.options || props.filter.entities"
           :key="`${option.id}-${selectedOptionIds?.includes(option.id)}`">
        <ProductOptionColor
            :option="option"
            :is-active="selectedOptionIds?.includes(option.id)"
            size="sm"
            @click="
            emits('select-value', {
              code: props.filter.code,
              value: option.id,
              })"
        />
      </div>
    </div>
  </AccordionContent>

</template>
<!--
  <div class="border-b border-secondary-200 py-6 px-5" v-show="false">
    <h3 class="-my-3 flow-root">
      <button
          type="button"
          class="flex w-full items-center justify-between bg-white py-2 text-base text-secondary-400 hover:text-secondary-500"
          @click="toggle"
      >
        <span class="font-medium text-secondary-900 text-left">{{
            props.filter.label
          }}</span>
        <span class="ml-6 flex items-center">
          <i
              :class="[
              !isFilterVisible
                ? 'i-carbon-chevron-down'
                : 'i-carbon-chevron-up',
            ]"
          />
        </span>
      </button>
    </h3>

    <transition name="fade" mode="out-in">
      <div v-show="isFilterVisible" :id="props.filter.code" class="pt-6">
        <fieldset class="space-y-4">
          <legend class="sr-only">{{ props.filter.name }}</legend>
          <div
              v-for="option in props.filter.options || props.filter.entities"
              :key="`${option.id}-${selectedOptionIds?.includes(option.id)}`"
              class="flex items-center"
          >
            <input
                :id="`filter-mobile-${props.filter.code}-${option.id}`"
                :checked="selectedOptionIds?.includes(option.id)"
                :name="props.filter.name"
                :value="option.name"
                :aria-label="`${option.name} filter`"
                type="checkbox"
                class="h-4 w-4 border-secondary-300 rounded text-indigo-600 focus:ring-indigo-500"
                @update:modelValue="
                emits('select-value', {
                  code: props.filter.code,
                  value: option.id,
                })
              "
            />

            <div v-if="option.media?.url">
              <img
                  loading="lazy"
                  class="ml-2 h-4 w-4"
                  :src="option.media.url"
                  :alt="option.media.translated.alt || ''"
                  :class="{
                  'border-blue border-2': selectedOptionIds?.includes(
                    option.id,
                  ),
                }"
              />
            </div>
            <div
                v-else-if="option.colorHexCode"
                class="ml-2 h-4 w-4"
                :style="`background-color: ${option.colorHexCode}`"
                :class="{
                'border-blue border-2': selectedOptionIds?.includes(option.id),
              }"
            />
            <label
                :for="`filter-mobile-${props.filter.code}-${option.id}`"
                class="ml-3 text-secondary-600"
            >
              {{ getTranslatedProperty(option, "name") }}{{ option.count ? " (" + option.count + ")" : "" }}
            </label>
          </div>
        </fieldset>
      </div>
    </transition>
  </div>
-->
