/**
 * Converts speed from meters per second to kilometers per hour.
 * @param speedInMS The speed in meters per second.
 * @returns The speed in kilometers per hour.
 */
export function convertMSToKMH(speedInMS: number): number {
    return  Math.round(speedInMS * 3.6 );
}

/**
 * Returns the short day of the week for a given date.
 * @param dateInput - The input date as a string or Date object.
 * @returns The short day of the week (e.g., "Sun", "Mon", etc.).
 * @throws Error if the date input is invalid.
 */
export function getShortDayOfWeek(dateInput: string | Date): string {
    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
        throw new Error('Invalid date input');
    }

    const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dayIndex = date.getDay();
    
    return shortDays[dayIndex];
}