import { FromUnsplashApiImage, getUnsplashImagesByQuery } from "../../api/unsplash.get";


/**
 * Renders country images in the specified container element.
 * 
 * @param containerElement - The HTML element where the images will be rendered.
 * @param country - The country object containing the code and name of the country.
 * @returns A promise that resolves when the images are rendered.
 * @throws If there is an error fetching or displaying the images.
 */
export async function countryImagesComponentFn(containerElement: HTMLElement, country: { code: string, name: string }): Promise<void>{
    try {
        const images: FromUnsplashApiImage[] = await getUnsplashImagesByQuery(country.name, 1, 8);

        images.forEach((image) => {
            const img: HTMLImageElement = document.createElement('img');
            img.src = image.urls.small;
            img.title = `${country.code} - ${country.name}\nhttps://unsplash.com/\n${image.description||''}`;
            img.alt = image.alt_description;
            img.classList.add('card-media', 'country-media-s');
            containerElement.appendChild(img);
        });
    } catch (error) {
        console.error('Error fetching or displaying images:', error);
        throw error;
    }
}