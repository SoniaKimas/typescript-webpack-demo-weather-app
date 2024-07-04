interface Config {
    GOOGLE_API_KEY: string;
    GOOGLE_MAP_ID: string;
    TOMORROWIO_API_KEY: string;
    UNSPLASH_API_KEY: string;
}

// directly here because is a demo project
const CONFIG: Config = {
    GOOGLE_API_KEY : '{--key--}',
    GOOGLE_MAP_ID : '{--key--}',
    TOMORROWIO_API_KEY : '{--key--}',
    UNSPLASH_API_KEY : '{--key--}'
}

export function getConfig(): Config {
    return CONFIG;
}