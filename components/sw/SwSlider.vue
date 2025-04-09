<script setup lang="ts">
import type {Schemas} from "#shopware";
import type {VNodeArrayChildren} from "vue";
import {ChevronLeft, ChevronRight} from "lucide-vue-next"

const containerRef = ref(null)
const swiper = useSwiper(containerRef)

const slides = ref(Array.from({length: 10}))


const props = withDefaults(
    defineProps<{
      config: SliderElementConfig;
      slidesToShow?: number;
      slidesToScroll?: number;
      gap?: string;
      autoplay?: boolean;
      autoplaySpeed?: number;
    }>(),
    {
      slidesToShow: 1,
      slidesToScroll: 1,
      gap: "0px",
      autoplay: false,
      autoplaySpeed: 3000,
    },
);
console.log(props);

const {getConfigValue} = useCmsElementConfig({
  config: props.config,
} as Schemas["CmsSlot"] & {
  config: SliderElementConfig;
});

const slots = useSlots() as {
  default?: () => { children: VNodeArrayChildren }[];
};

const childrenRaw = computed(
    () => (slots?.default?.()[0].children as VNodeArrayChildren) ?? [],
);

const slidesToShow = computed(() =>
    props.slidesToShow >= childrenRaw.value.length
        ? childrenRaw.value.length
        : props.slidesToShow,
);

const children = computed<string[]>(() => {
  if (childrenRaw.value.length === 0) return [];
  return [
    ...childrenRaw.value
  ] as string[];
});

const spaceBetweenSlides: ComputedRef<number> = computed(oldValue => {
  const gap = props.gap
  if (gap.includes('px')) {
    return Number(gap.replace('px', ''));
  }
  if (gap.includes('rem')) {
    return Number(gap.replace('rem', '')) * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  return 0;
})

onMounted(() => {
})
</script>

<template>
  <div class="sw-slider relative">
    <ClientOnly fallbackTag="div">
      <swiper-container class="overflow-visible" ref="containerRef" :slides-per-view="slidesToShow"
                        :space-between="spaceBetweenSlides" :loop="false">
        <swiper-slide
            v-for="(child, index) of children"
            :key="index"
            :index="index - slidesToShow"
        >
          <component :is="child as any"/>
        </swiper-slide>
      </swiper-container>

      <template #fallback>
        <div :class="'grid-cols-' + slidesToShow +' grid fallback-grid'" :style="{'gap': gap}">
          <div v-for="(child, index) of children" :key="index">
            <component :is="child as any"/>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Go back one slide -->
    <Button size="icon" @click="swiper.prev()" class="absolute z-20 top-[50%] translate-y-[-50%] translate-x-[-150%]">
      <ChevronLeft/>
    </Button>
    <!-- Go forward one slide -->
    <Button size="icon" @click="swiper.next()"
            class="absolute z-20 top-[50%] right-0 translate-y-[-50%] translate-x-[150%]">
      <ChevronRight/>
    </Button>
  </div>
</template>

<style scoped>
.fallback-grid:nth-child(n+4) {
  display: none;
}
</style>