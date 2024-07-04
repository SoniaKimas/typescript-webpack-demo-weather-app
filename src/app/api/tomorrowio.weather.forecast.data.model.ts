export interface ForecastWeatherData {
    timelines: {
        daily: {
            time: string,
            values: {
                cloudCoverAvg: number,
                humidityAvg: number,
                precipitationProbabilityAvg: number,
                temperatureAvg: number,
                windSpeedAvg: number,
            }
        }[];
    };
}