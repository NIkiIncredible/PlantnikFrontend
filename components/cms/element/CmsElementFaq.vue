<template>
  <div class="cms-element-faq" itemscope itemtype="https://schema.org/FAQPage">
    <Accordion type="single" class="w-full transition duration-700" collapsible :default-value="defaultValue">

      <AccordionItem class="transition duration-700" v-for="item in items" :key="item.id" :value="item.id"
                     itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <AccordionTrigger itemprop="name">{{ item.q }}</AccordionTrigger>
        <AccordionContent itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div itemprop="text">
            {{ item.a }}
          </div>
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  </div>
</template>

<script setup lang=ts>
import type {CmsElementFaq, FaqElementConfigItem} from "~/types/CmsElementFaq.d.ts";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'

const props = defineProps<{
  content: CmsElementFaq;
}>();

const items: ComputedRef<FaqElementConfigItem[]> = computed(() => props.content.config.items.value)
const defaultValue = items.value[0].id;

useSchemaOrg([{
  '@type': 'FAQPage',
  mainEntity: items.value.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  }))
}])
</script>

<style scoped>
/* styles.css */
.AccordionContent {
  overflow: hidden;
}

.AccordionContent[data-state="open"] {
  animation: slideDown 300ms ease-out;
}

.AccordionContent[data-state="closed"] {
  animation: slideUp 300ms ease-out;
}

@keyframes slideDown {
  from {
    height: 0;
  }
  to {
    height: var(--reka-accordion-content-height);
  }
}

@keyframes slideUp {
  from {
    height: var(--reka-accordion-content-height);
  }
  to {
    height: 0;
  }
}
</style>