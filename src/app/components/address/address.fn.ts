
interface Address {
    formattedAddress: string;
    country?: { long_name: string, short_name: string };
    locality?: { long_name: string, short_name: string };
}

/**
 * Renders the address component in the specified container element.
 * @param containerElement - The HTML element where the address component will be rendered.
 * @param addressInfos - The address information to be displayed.
 */
export function addressComponentFn(containerElement: HTMLElement, addressInfos: Address) {

    containerElement.innerHTML = `
        <div class="address-item">
            <span>${addressInfos.formattedAddress}</span>
        </div>
        `;
}

// <div class="address-item">
//     <span>${addressInfos.locality?.long_name} * ${addressInfos.country?.long_name}</span>
// </div>