'use client';
import { Box } from '@mui/material';
import style from './home.module.scss';
import { useEffect, useState } from 'react';

import citiesData from '../data/cities.json';
import Tables from '@/components/Table/Table';
import Chart from '@/components/Chart/Chart';

interface WeatherData {
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    winddirection_10m_dominant: number[];
    cityName: string;
    country: string;
  };
}

export default function Home() {
  const [cityWeather, setCityWeather] = useState<Array<WeatherData | null>>([]);

  const [selectCountry, setSelectCountry] = useState<string[]>([]);
  const [selectMinTemp, setSelectMinTemp] = useState<number | null>(null);
  const [selectMaxTemp, setSelectMaxTemp] = useState<number | null>(null);

  const [selectChartCity, setSelectChartCity] = useState<string | null>(null);
  const [chartCityTemp7Day, setChartCityTemp7Day] = useState<number[] | null>(
    Array(7).fill(0),
  );

  //Chart logic

  const minTemperature = -40;
  const maxTemperature = 60;

  const temperatureRange = maxTemperature - minTemperature;

  const averageTemperaturesScaled =
    chartCityTemp7Day &&
    chartCityTemp7Day.map(value => {
      const normalizedValue = (value - minTemperature) / temperatureRange;
      const scaledValue = normalizedValue * 318;
      const reversedValue = 318 - scaledValue;

      return reversedValue;
    });

  useEffect(() => {
    if (selectChartCity === null) {
      setChartCityTemp7Day(Array(7).fill(0));
    }
    if (selectChartCity !== null) {
      const matchingCity = cityWeather.find(
        weatherData => weatherData?.daily.cityName === selectChartCity,
      );
      if (matchingCity) {
        const maxTemperatures = matchingCity.daily.temperature_2m_max;
        const minTemperatures = matchingCity.daily.temperature_2m_min;

        const averageTemperatures: number[] = maxTemperatures.map(
          (maxTemp, index) => {
            const minTemp = minTemperatures[index];
            const averageTemp = (maxTemp + minTemp) / 2;
            return averageTemp;
          },
        );

        setChartCityTemp7Day(averageTemperatures);
      } else {
        console.log('No matching city found');
      }
    }
  }, [selectChartCity, cityWeather]);

  // Table logic
  const defaultDataFetch = async () => {
    const weatherData = await Promise.all(
      citiesData.map(async city => {
        try {
          const response = await fetch(city.link);
          const data: WeatherData = await response.json();
          data.daily.cityName = city.name;
          data.daily.country = city.country;
          return data;
        } catch (error) {
          console.error(`Error fetching weather data for ${city.name}:`, error);
          return null;
        }
      }),
    );

    setCityWeather(weatherData.filter(data => data !== null));
    const countries = weatherData.map(data => data?.daily.country) as string[];
    setSelectCountry(countries);
  };

  useEffect(() => {
    defaultDataFetch();
  }, []);

  const filterCountry = (value: string[]) => {
    if (value.length === 0) {
      defaultDataFetch();
    }

    if (value.length >= 1) {
      setSelectCountry(value);
    }
  };

  const filterMinTemp = (value: number | null) => {
    if (value === 0) {
      defaultDataFetch();
    }

    if (value !== 0) {
      setSelectMinTemp(value);
    }
  };

  const filterMaxTemp = (value: number | null) => {
    if (value === 0) {
      defaultDataFetch();
    }

    if (value !== 0) {
      setSelectMaxTemp(value);
    }
  };

  const handleCityClick = (value: string) => {
    setSelectChartCity(value);
  };

  return (
    <Box className={style.homePage}>
      <Box className={style.container}>
        <Chart averageTemperaturesScaled={averageTemperaturesScaled} />
        <Tables
          cityWeather={cityWeather}
          selectCountry={selectCountry}
          selectMaxTemp={selectMaxTemp}
          selectMinTemp={selectMinTemp}
          handleCityClick={handleCityClick}
          filterCountry={filterCountry}
          filterMinTemp={filterMinTemp}
          filterMaxTemp={filterMaxTemp}
        />
      </Box>
    </Box>
  );
}
