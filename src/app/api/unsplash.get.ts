import axios from 'axios';
import { getConfig } from '../../config/config';
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';


export interface FromUnsplashApiImage {
    urls: { small: string };
    description: string;
    alt_description: string;
};

interface UnsplashResponse {
    results: FromUnsplashApiImage[];
}

/**
 * Retrieves Unsplash images based on the provided query.
 * @param query - The search query for the images.
 * @param page - The page number of the search results (default: 1).
 * @param perPage - The number of images per page (default: 10).
 * @returns A promise that resolves to an array of Unsplash images.
 * @throws If there is an error fetching images from Unsplash.
 */
export const getUnsplashImagesByQuery = async (query: string, page: number = 1, perPage: number = 10): Promise<FromUnsplashApiImage[]> => {
    try {
        const response = await axios.get<UnsplashResponse>(`${UNSPLASH_BASE_URL}/search/photos`, {
            params: {
                query,
                page,
                per_page: perPage,
                client_id: getConfig().UNSPLASH_API_KEY,
            },
        });

        return response.data.results;
    } catch (error) {
        console.error('Error fetching images from Unsplash:', error);
        throw error;
    }
};





// export const getUnsplashRandomImage = async () => {
//     try {
//         const response = await axios.get(`${UNSPLASH_BASE_URL}/photos/random`, {
//             params: {
//                 client_id: getConfig().UNSPLASH_API_KEY,
//             },
//         });

//         return response.data;
//     } catch (error) {
//         console.error('Error fetching random image from Unsplash:', error);
//         throw error;
//     }
// };