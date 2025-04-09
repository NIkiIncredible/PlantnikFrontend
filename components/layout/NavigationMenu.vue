<template>
  <NavigationMenu :disablePointerLeaveClose="false">
    <NavigationMenuList>
      <NavigationMenuItem v-for="item in navigationElements" :key="item.id">

        <!-- If category is a parent, add children -->
        <template v-if="item.childCount > 0">

          <NavigationMenuTrigger class="nav-item">
            <NuxtLink :to="formatLink(getCategoryRoute(item))">
              {{ item.translated.name }}
            </NuxtLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)] z-50">

              <!-- Show category children -->
              <li v-for="childItem in item.children">
                <NuxtLinkLocale
                    v-slot="{ isActive, href, navigate }"
                    :to="getCategoryRoute(childItem)"
                    custom
                >
                  <NavigationMenuLink
                      :active="isActive"
                      :href @click="navigate"
                      as-child
                  >
                    <a :href
                       class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div class="text-sm font-medium leading-none">{{ childItem.translated.name }}</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground"
                         v-if="childItem.translated.description" v-html="childItem.translated.description"></p>
                    </a>
                  </NavigationMenuLink>
                </NuxtLinkLocale>
              </li>

              <!-- Container for media or description if available -->
              <li class="row-span-3" v-if="item.translated.description || item.mediaId">
                <NavigationMenuLink as-child>
                  <NuxtLinkLocale
                      as="a"
                      class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                  >
                    <img :srcset="getSrcSetForMedia(item.media ? item.media : item.mediaId)"
                         class="max-w-full rounded-md">
                    <div v-if="item.translated.description" v-html="item.translated.description"
                         class="text-muted-foreground">
                    </div>
                  </NuxtLinkLocale>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </template>

        <!-- Without children only display parent link -->
        <template v-else>
          <NuxtLinkLocale
              v-slot="{ isActive, href, navigate }"
              :to="formatLink(getCategoryRoute(item))"
          >
            <NavigationMenuLink
                :class="navigationMenuTriggerStyle() + ' nav-item'"
                :target="item.externalLink || item.linkNewTab ? '_blank' : ''">
              {{ item.translated.name }}
            </NavigationMenuLink>
          </NuxtLinkLocale>
        </template>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>

<script setup lang="ts">
import {navigationMenuTriggerStyle,} from '@/components/ui/navigation-menu'
import {getCategoryRoute, getSrcSetForMedia} from "@shopware/helpers";

const {loadNavigationElements, navigationElements} = useNavigation();
await loadNavigationElements({depth: 2});

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>

<style scoped>
@reference "~/assets/css/tailwind.css";

:deep(.nav-item) {
  @apply text-base font-medium leading-none;
}
</style>