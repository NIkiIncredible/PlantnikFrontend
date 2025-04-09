<script setup lang="ts">
import type {CmsElementImageGallery} from "@shopware/composables";
import {computed, onMounted, ref, useTemplateRef} from "vue";
import {useCmsElementConfig} from "#imports";
import {getSmallestThumbnailUrl, getSrcSetForMedia, getTranslatedProperty} from "@shopware/helpers";

const props = withDefaults(
    defineProps<{
      content: CmsElementImageGallery;
      slidesToShow?: number;
      slidesToScroll?: number;
    }>(),
    {
      slidesToShow: 5,
      slidesToScroll: 4,
    },
);

const {getConfigValue} = useCmsElementConfig(props.content);

const speed = ref<number>(300);
const currentIndex = ref(0);
const currentThumb = ref(0);
const imageSlider = useTemplateRef("imageSlider");
const imageThumbsTrack = useTemplateRef("imageThumbsTrack");
const isLoading = ref(true);
const imageThumbsTrackStyle = ref({});
const imageThumbs = useTemplateRef("imageThumbs");
const imageThumbsStyle = ref({});
const mediaGallery = computed(() => props.content.data?.sliderItems ?? []);
const galleryPosition = computed<string>(
    () => getConfigValue("galleryPosition") ?? "left",
);
const scrollPx = ref(0);

onMounted(() => {
  initThumbs();
});

function initThumbs() {
  if (imageThumbsTrack.value) {

    setTimeout(() => {
      if (galleryPosition.value === "left") {
        const clientHeight = imageThumbsTrack.value?.clientHeight ?? 0;
        scrollPx.value = clientHeight / mediaGallery.value.length;
        imageThumbsStyle.value = {
          height: `${scrollPx.value * +props.slidesToShow}px`,
        };
      } else {
        const clientWidth = imageThumbs.value?.clientWidth ?? 0;
        scrollPx.value = clientWidth / props.slidesToShow;
        imageThumbsTrackStyle.value = {
          width: `${scrollPx.value * mediaGallery.value.length}px`,
        };
      }
    }, 100);
  } else {
    isLoading.value = false;
  }
}

function changeCover(i: number) {
  if (i === currentIndex.value) return;
  imageSlider.value?.goToSlide(i);
}

function handleChangeSlide(e: number) {
  currentIndex.value = e;
  if (currentIndex.value > currentThumb.value + props.slidesToShow - 1) {
    move("next", currentIndex.value);
    return;
  }
  if (currentIndex.value < currentThumb.value) {
    move("previous", currentIndex.value);
    return;
  }
}

function move(type: "next" | "previous", specificIndex?: number | string) {
  let step: number;
  const index =
      typeof specificIndex !== "number"
          ? Number.parseInt(specificIndex as string)
          : specificIndex;
  if (index >= 0) {
    if (type === "next") {
      step =
          index + props.slidesToScroll < mediaGallery.value.length
              ? index
              : mediaGallery.value.length - props.slidesToShow;
    } else {
      step =
          index - props.slidesToScroll > 0 ? index - props.slidesToScroll : 0;
    }
  } else {
    if (type === "next") {
      step =
          currentThumb.value + props.slidesToShow - 1 + props.slidesToScroll <
          mediaGallery.value.length
              ? currentThumb.value + props.slidesToScroll
              : mediaGallery.value.length - props.slidesToShow;
    } else {
      step =
          currentThumb.value - props.slidesToScroll > 0
              ? currentThumb.value - props.slidesToScroll
              : 0;
    }
  }
  currentThumb.value = step;
  let xAxis = 0;
  let yAxis = 0;
  if (galleryPosition.value === "left") {
    yAxis = scrollPx.value * currentThumb.value;
  } else {
    xAxis = scrollPx.value * currentThumb.value;
  }
  imageThumbsTrackStyle.value = {
    ...imageThumbsTrackStyle.value,
    transform: `translate3d(-${xAxis}px, -${yAxis}px, 0px)`,
    transition: `transform ${speed.value}ms ease 0s`,
  };
}

function previous() {
  if (currentThumb.value <= 0) {
    return;
  }
  move("previous");
}

function next() {
  if (currentThumb.value + props.slidesToShow >= mediaGallery.value.length) {
    return;
  }
  move("next");
}
</script>

<template>
  <div class="cms-element-image-gallery">
    <div class="grid md:grid-cols-2 gap-5">
      <template v-if="isLoading">
        <div :class="'aspect-square loader w-full h-full image-' + n" v-for="n in mediaGallery.length">pups</div>
      </template>
      <template v-else>
        <div v-for="(image, index) of mediaGallery"
             :class="' aspect-square gallery-image-wrapper h-full w-full  image-' + (index+1)">
          <img :src="getSmallestThumbnailUrl(image.media)"
               :srcset="getSrcSetForMedia(image.media)"
               :alt="getTranslatedProperty(image.media, 'alt')"
               class="rounded-md">

          <!--          <CmsElementImage-->
          <!--              :key="image.media.url"-->
          <!--              :image-gallery="true"-->
          <!--              :content="{ data: image, config: props.content.config } as any"-->
          <!--          />-->
        </div>
      </template>
    </div>

    <div
        v-if="false"
        :class="{
      'opacity-0': isLoading,
      'flex gap-10': true,
      'flex-col-reverse': galleryPosition === 'underneath',
    }"
    >
      <div
          :class="{
        'hidden lg:flex basis-20 relative flex-col items-center':
          galleryPosition === 'left',
        'flex relative w-full': galleryPosition === 'underneath',
      }"
      >
        <button
            v-if="mediaGallery.length > slidesToShow"
            class="disabled:opacity-10 p-1"
            aria-label="Previous image"
            @click="previous"
        >
          <div
              class="h-7 w-7"
              :class="{
            'i-carbon-chevron-up': galleryPosition === 'left',
            'i-carbon-chevron-left': galleryPosition !== 'left',
          }"
          />
        </button>
        <span class="sr-only">Previous image</span>
        <div
            ref="imageThumbs"
            class="overflow-hidden -my-2.5"
            :style="imageThumbsStyle"
        >
          <div
              ref="imageThumbsTrack"
              :class="{
            flex: true,
            'flex-col': galleryPosition === 'left',
          }"
              :style="imageThumbsTrackStyle"
          >
            <div
                v-for="(image, i) in mediaGallery"
                :key="image.media.url"
                :class="{
              'py-2.5': galleryPosition === 'left',
              'flex-1 px-2.5': galleryPosition === 'underneath',
            }"
            >
              <div
                  class="w-20 h-20 overflow-hidden cursor-pointer p-1 border-secondary-200 rounded transition duration-150 ease-in-out"
                  :class="{
                border: i !== currentIndex,
                'border-indigo-500 border-3': i === currentIndex,
              }"
                  @click="() => changeCover(i)"
              >
                <img
                    loading="lazy"
                    :src="image.media.url"
                    class="w-full h-full object-center object-cover"
                    alt="Product image"
                />
              </div>
            </div>
          </div>
        </div>
        <button
            v-if="mediaGallery.length > slidesToShow"
            class="disabled:opacity-10 p-1"
            aria-label="Next image"
            @click="next"
        >
          <span class="sr-only">Next image</span>
          <div
              class="h-7 w-7"
              :class="{
            'i-carbon-chevron-down': galleryPosition === 'left',
            'i-carbon-chevron-right': galleryPosition !== 'left',
          }"
          />
        </button>
      </div>
      <div class="flex-1 overflow-hidden">
        <SwSlider
            ref="imageSlider"
            :config="props.content.config"
            @change-slide="handleChangeSlide"
        >
          <CmsElementImage
              v-for="image of mediaGallery"
              :key="image.media.url"
              :image-gallery="true"
              :content="{ data: image, config: props.content.config } as any"
          />
        </SwSlider>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery-image-wrapper {
  @apply aspect-square;
}

.gallery-image {
  object-fit: cover;
}

.image-1 {
  grid-area: 1 / 1 / 3 / 2;

  & :deep(img) {
    @apply object-cover h-full;
  }
}

.image-2 {
  grid-area: 1 / 2 / 2 / 3;

  & :deep(img) {
    @apply aspect-square object-cover;
  }
}

.image-3 {
  grid-area: 2 / 2 / 3 / 3;

  & :deep(img) {
    @apply aspect-square object-cover;
  }
}

.image-4 {
  grid-area: 3 / 1 / 4 / 2;

  & :deep(img) {
    @apply aspect-square object-cover;
  }
}

.image-5 {
  grid-area: 3 / 2 / 5 / 3;

  & :deep(img) {
    @apply aspect-square object-cover;
  }
}

.image-6 {
  grid-area: 4 / 1 / 5 / 2;

  & :deep(img) {
    @apply aspect-square object-cover;
  }
}

.image-7 {
  grid-area: 5 / 1 / 6 / 2;

  & :deep(img) {
    @apply aspect-square object-cover;
  }
}

.image-8 {
  grid-area: 5 / 2 / 6 / 3;

  & :deep(img) {
    @apply aspect-square object-cover;
  }
}
</style>