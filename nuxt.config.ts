// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
import tailwindcss from '@tailwindcss/vite'
import {defineOrganization} from 'nuxt-schema-org/schema'

export default defineNuxtConfig({
    extends: ["@shopware/composables/nuxt-layer", "@shopware/cms-base-layer"],
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    css: [
        "~/assets/css/style.css"
    ],

    //USELESS???
    shopware: {
        endpoint: "https://demo-frontends.shopware.store/store-api/",
        accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    },

    runtimeConfig: {
        public: {
            shopware: {
                endpoint: "https://your-business.shopware.store",
                accessToken: "access-token-from-settings"
            },
            broadcasting: false,
        },
    },

    routeRules: {
        "/": {
            isr: 60 * 60 * 24,
        },
        "/checkout": {
            ssr: false,
            headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        },
        "/checkout/**": {
            ssr: false,
        },
        "/login": {
            ssr: false,
        },
        "/register": {
            ssr: false,
        },
        "/reset-password": {
            ssr: false,
        },
        "/wishlist": {
            ssr: false,
        },
        "/account": {
            ssr: false,
        },
        "/account/**": {
            ssr: false,
        },
        "/search": {
            ssr: false,
        },
        "/search/**": {
            ssr: false,
        },
        "/**": {
            isr: 60 * 60 * 24,
        },
    },

    /**
     * Commented because of the StackBlitz error
     * Issue: https://github.com/shopware/frontends/issues/88
     */
    typescript: {
        // typeCheck: true,
        strict: true,
    },

    modules: [
        "@vueuse/nuxt",
        "@shopware/nuxt-module",
        "@nuxtjs/i18n",
        "shadcn-nuxt",
        '@nuxtjs/color-mode',
        "nuxt-swiper",
        "nuxt-schema-org",
    ],

    components: {
        dirs: [
            {
                path: "~/components",
                priority: 2,
            },
        ],
        global: true,
    },

    vueuse: {
        ssrHandlers: true,
    },

    nitro: {
        compressPublicAssets: true,
    },

    router: {
        options: {
            linkActiveClass: "link-active",
            linkExactActiveClass: "link-exact-active text-primary",
        },
    },

    i18n: {
        strategy: "prefix_except_default",
        defaultLocale: "de-DE",
        detectBrowserLanguage: false,
        langDir: "./src/langs/",
        vueI18n: "./config",
        locales: [
            {
                code: "en-GB",
                language: "en-GB",
                file: "en-GB.ts",
            },
            {
                code: "de-DE",
                language: "de-DE",
                file: "de-DE.ts",
            },
        ],
    },

    shadcn: {
        prefix: '',
        componentDir: './components/ui'
    },
    colorMode: {
        classSuffix: ''
    },

    schemaOrg: {
        identity: defineOrganization({
            '@type': ['Organization', 'Store', 'OnlineStore'],

            // Basic Information
            'name': 'Plantnik',
            'logo': '~/assets/images/logo/plantnik.png',
        }),
    },

    telemetry: false,
    compatibilityDate: "2025-04-04",
});