import {beforeEach, describe, expect, it, vi} from "vitest";
import { WeatherService } from "./weather-kata";

describe("WeatherService", () => {
    let service : WeatherService;
    let mockWeatherAPI : { getTemperature: (city: string) => number };

    beforeEach(() => {
        mockWeatherAPI = { getTemperature: vi.fn() };
        service = new WeatherService(mockWeatherAPI);
    })

    it("should return Hot Message when the temperature is above 30 degrees", () => {

        vi.mocked(mockWeatherAPI.getTemperature).mockReturnValue(35);

        const result = service.getWeatherMessage("Ahmedabad");

        expect(result).toBe("Ahmedabad is hot");
    })

    it("should return Cold Message when the temperature is below 10 degrees", () => {
        vi.mocked(mockWeatherAPI.getTemperature).mockReturnValue(9);

        const result = service.getWeatherMessage("Himachal");

        expect(result).toBe("Himachal is cold");
    })

    it("should return Pleasant Message when the temperature is between 10 and 30 degrees", () => {
        vi.mocked(mockWeatherAPI.getTemperature).mockReturnValue(15);

        const result = service.getWeatherMessage("Bangalore");

        expect(result).toBe("Bangalore is Pleasant");
    })

    it("should ask for Temperature when function getWeatherMessage is called with city (Ahmedabad)", () => {

    })
})