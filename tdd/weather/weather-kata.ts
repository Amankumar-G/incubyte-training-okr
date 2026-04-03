// class WeatherAPI {
//     getTemperature(city: string){
//         return 35;
//     }
// }

//we were here at interface
interface WeatherAPI {
    getTemperature(city: string): number;
}


export class WeatherService {

    constructor(private weatherAPI : WeatherAPI) {}

    getWeatherMessage(city: string): string {
        const temperature = this.weatherAPI.getTemperature(city);

        if(temperature > 30) {
            return `${city} is hot`;
        }
        if(temperature < 10) {
            return `${city} is cold`;
        }
        return `${city} is Pleasant`;
    }
}