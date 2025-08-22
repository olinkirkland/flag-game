export function getRandomCountry() {
    // TODO: Implement logic to get a random country
    return 'us';
}

export function getColorsForCountry(country: string): string[] {
    // TODO: Implement logic to get colors for the given country
    return ['0xFF0000', '0xFFFFFF', '0x0000FF'];
}

/**
 * Get a random selection of unique colors, that includes the usedColors.
 * @param usedColors - Array of colors that have already been used.
 * @param colorCount - Number of colors to select, default is 8.
 * @return Array of random colors, including the used colors.
 */
export function getRandomColors(
    usedColors: string[],
    colorCount: number = 8
): string[] {
    // TODO: Implement logic to get random colors excluding the specified colors
    const allColors = [
        '0xFF0000',
        '0x00FF00',
        '0x0000FF',
        '0xFFFF00',
        '0xFFFFFF',
        '0x000000'
    ]; // Example color list, should be replaced with complete list of unique colors across all countries

    // Filter out used colors
    const availableColors = allColors.filter(
        (color) => !usedColors.includes(color)
    );

    // Shuffle available colors and select the first `colorCount` colors
    const shuffledColors = availableColors.sort(() => 0.5 - Math.random());
    return shuffledColors.concat(usedColors).slice(0, colorCount);
}