// composables/useSrcSetSizes.ts

const defaultTailwindScreens: Record<string, number> = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

/**
 * Generates a responsive `sizes` attribute string from a srcset, using Tailwind's default breakpoints.
 * @param srcset - A string like `... 400w, ... 800w, ... 1920w`
 * @returns A `sizes` attribute string like `(max-width: 640px) 400px, ...`
 */
export function useSrcSetSizes(srcset: string): string {
    if (!srcset || typeof srcset !== 'string') return '';

    const widthMatches = Array.from(srcset.matchAll(/(\d+)w/g))
        .map(match => parseInt(match[1], 10))
        .filter(Number.isFinite);

    if (widthMatches.length === 0) return '';

    const sortedWidths = [...new Set(widthMatches)].sort((a, b) => a - b);

    const breakpoints = Object.entries(defaultTailwindScreens)
        .map(([key, value]) => ({ name: key, max: value }))
        .sort((a, b) => a.max - b.max);

    const sizeMappings = breakpoints.map((bp, i) => {
        const width = sortedWidths[i] || sortedWidths.at(-1);
        return `(max-width: ${bp.max}px) ${width}px`;
    });

    const fallback = `${sortedWidths.at(-1)}px`;

    return `${sizeMappings.join(', ')}, ${fallback}`;
}
