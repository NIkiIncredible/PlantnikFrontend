// Text
import type {ElementConfig} from "@shopware/composables/src/types/cmsElementTypes";

export type CmsElementIcon = Schemas["CmsSlot"] & {
    type: "image" | typeof String;
    slot: typeof String;
    config: IconElementConfig;
    fieldConfig: ElementFieldConfig[];
    data: {
        content: string;
        apiAlias: "cms_icon";
    };
};

type IconElementConfig = {
    icon: ElementConfig<string>;
    size: ElementConfig<number>;
    color: ElementConfig<string>;
};