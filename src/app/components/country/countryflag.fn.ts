import { getCountryFlag } from "../../api/flagcdn.get";


/**
 * Renders the country flag component.
 * 
 * @param containerElement - The HTML element where the flag component will be rendered.
 * @param country - The country object containing the code and name of the country.
 * @returns A promise that resolves when the flag component is rendered.
 * @throws An error if there is an issue rendering the flag component.
 */
export async function countryFlagComponentFn( containerElement: HTMLElement,country:{code: string, name: string}): Promise<void>{
    try {
        const flag =  await getCountryFlag(country.code);
        flag.classList.add('card-media', 'country-media-s');
        flag.title= `FLAG \n${country.code} - ${country.name}\n` + flag.title;
        containerElement.appendChild(flag);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

