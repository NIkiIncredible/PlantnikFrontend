<script setup lang="ts">
const { breadcrumbs } = useBreadcrumbs();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>
<template>
  <div class="container m-auto my-5">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <template v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.path">
          <BreadcrumbItem >
            <BreadcrumbLink :href="formatLink(breadcrumb.path)">
              {{breadcrumb.name}}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator v-if="index !== breadcrumbs.length - 1"/>
        </template>

      </BreadcrumbList>
    </Breadcrumb>
  </div>
</template>
