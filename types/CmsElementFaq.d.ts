// Text
import type {ElementConfig} from "@shopware/composables/src/types/cmsElementTypes";

export type CmsElementFaq = Schemas["CmsSlot"] & {
    type: "text" | typeof String;
    slot: typeof String;
    config: FaqElementConfig;
    fieldConfig: ElementFieldConfig[];
    data: {
        content: string;
        apiAlias: "cms_slot";
    };
};

export type FaqElementConfig = {
    items: FaqElementConfigItem[]
};

export type FaqElementConfigItem = {
    q: ElementConfig<string>;
    a: ElementConfig<string>;
    id: ElementConfig<string>;
}