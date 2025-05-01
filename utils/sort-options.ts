import type {components} from "~/api-types/storeApiTypes";

export default function (options: components["schemas"]["PropertyGroupOption"][] | undefined) {
    if (!options) return [];

    return options.sort((a, b) => {
        // If group or position is not available for a, it should be behind
        if (!a.group || a.group.position === undefined) return 1;
        // If group or position is not available for b, it should be behind
        if (!b.group || b.group.position === undefined) return -1;
        // If both have position, sort normally
        return a.group.position - b.group.position;
    });
}
