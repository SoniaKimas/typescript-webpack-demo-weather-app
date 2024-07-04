import axios from 'axios';

const getCountryFlagUrl = (countryCode: string): string => {
    return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
};

/**
 * Retrieves the country flag image for the given country code.
 * @param countryCode - The country code for which to retrieve the flag.
 * @returns A Promise that resolves to an HTMLImageElement representing the country flag.
 * @throws If an error occurs during the retrieval process.
 */
export const getCountryFlag = async (countryCode: string): Promise<HTMLImageElement> => {
  const flagUrl = getCountryFlagUrl(countryCode);

  try {
      const response = await axios.get(flagUrl);
      
      const flagImg = new Image();

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(response.data, 'image/svg+xml');
      
      if (svgDoc.documentElement.tagName === 'svg') {
          flagImg.src = URL.createObjectURL(new Blob([response.data], { type: 'image/svg+xml' }));
          flagImg.alt = `${countryCode} Flag`;
      } else {
          throw new Error(`Invalid SVG received for ${countryCode}`);
      }

      flagImg.title = 'https://flagpedia.net';

      return flagImg;

  } catch (err) {
      console.error(err);
      throw err;
  }
};