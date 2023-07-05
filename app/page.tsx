'use client';
import { Box } from '@mui/material';
import style from './home.module.scss';
import { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import citiesData from '../data/cities.json';

// TABLE data
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#000000',
    color: theme.palette.common.white,
    border: 'none',
    fontFamily: '__Montserrat_bf7f7a',
    fontSize: 12,
    fontWeight: '600',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    backgroundColor: '#1A1A1A',
    color: theme.palette.common.white,
    border: 'none',
    fontFamily: '__Montserrat_bf7f7a',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

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

  //Chart
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  // Table
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
        <Box className={style.chartContainer}>
          <Box className={style.chartText}>
            <span>Analytics</span>
            <span>Value&#x2019;s name</span>
          </Box>
          <svg width="450" height="350">
            <defs>
              <linearGradient id="barGradient" gradientTransform="rotate(90)">
                <stop offset="0%" stopColor="#adea57" />
                <stop offset="100%" stopColor="#1c2c06" />
              </linearGradient>
            </defs>
            {[0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99].map(
              (value, index) => (
                <>
                  <line
                    x1="50"
                    x2="420"
                    y1={value * 310 + 8}
                    y2={value * 310 + 8}
                    stroke="#515151"
                    strokeWidth="1"
                    strokeDasharray="10, 8"
                    key={index}
                  />
                  <text
                    x={30}
                    y={value * 313 + 8}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="12px"
                  >
                    {60 - index * 10}
                  </text>
                </>
              ),
            )}
            {averageTemperaturesScaled &&
              averageTemperaturesScaled.map((value, index) => (
                <>
                  <rect
                    key={index}
                    x={index * 50 + 150 / 2}
                    y={value}
                    width="27"
                    rx={10}
                    height={318 - value}
                    fill="url(#barGradient)"
                  />
                  <text
                    x={index * 50 + 175 / 2}
                    y={335}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="13px"
                  >
                    {daysOfWeek[index]}
                  </text>
                </>
              ))}
          </svg>
        </Box>
        <Box className={style.tableContainer}>
          <Box className={style.filter}>
            <Autocomplete
              multiple
              onChange={(event, value) => filterCountry(value)}
              options={citiesData
                .map(optionName => optionName.country)
                .filter((value, index, self) => self.indexOf(value) === index)}
              sx={{
                marginBottom: 'auto',
                marginRight: '15px',
                borderRadius: '12px',
                width: 150,
                backgroundColor: '#313131',
                '& .MuiOutlinedInput-root': {
                  outline: '1px solid #707070',
                  padding: '0px 0px 0px 0px',
                  borderRadius: '12px',
                  '&:hover, &.Mui-focused': {
                    outline: '1px solid #707070',
                    padding: '0px 0px 0px 0px',
                  },
                  '&.Mui-focused': {
                    outline: 'none',
                  },
                  '& .MuiAutocomplete-paper': {
                    backgroundColor: 'red',
                  },
                },
                '& .MuiFormControl-root': {
                  '& .MuiFormLabel-root': {
                    fontFamily: '__Montserrat_bf7f7a',
                    fontSize: '14px',
                    top: '-8px  ',
                    '&.Mui-focused': {
                      top: '0px',
                    },
                  },
                },
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Country"
                  InputLabelProps={{
                    style: {
                      color: '#acacac',
                    },
                  }}
                />
              )}
            />
            <Autocomplete
              options={Array.from({ length: 33 }, (_, index) => index * 5 - 80)}
              onChange={(event, value) => filterMinTemp(value)}
              sx={{
                marginBottom: 'auto',
                marginRight: '15px',
                borderRadius: '12px',
                width: 150,
                backgroundColor: '#313131',
                '& .MuiOutlinedInput-root': {
                  outline: '1px solid #707070',
                  padding: '0px 0px 0px 0px',
                  borderRadius: '12px',
                  '&:hover, &.Mui-focused': {
                    outline: '1px solid #707070',
                    padding: '0px 0px 0px 0px',
                  },
                  '&.Mui-focused': {
                    outline: 'none',
                  },
                  '& .MuiAutocomplete-paper': {
                    backgroundColor: 'red',
                  },
                },
                '& .MuiFormControl-root': {
                  '& .MuiFormLabel-root': {
                    fontFamily: '__Montserrat_bf7f7a',
                    fontSize: '14px',
                    top: '-8px  ',
                    '&.Mui-focused': {
                      top: '0px',
                    },
                  },
                },
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Min"
                  InputLabelProps={{
                    style: {
                      color: '#acacac',
                    },
                  }}
                />
              )}
            />
            <Autocomplete
              options={Array.from({ length: 33 }, (_, index) => index * 5 - 80)}
              onChange={(event, value) => filterMaxTemp(value)}
              sx={{
                marginBottom: 'auto',
                borderRadius: '12px',
                width: 150,
                backgroundColor: '#313131',
                '& .MuiOutlinedInput-root': {
                  outline: '1px solid #707070',
                  padding: '0px 0px 0px 0px',
                  borderRadius: '12px',
                  '&:hover, &.Mui-focused': {
                    outline: '1px solid #707070',
                    padding: '0px 0px 0px 0px',
                  },
                  '&.Mui-focused': {
                    outline: 'none',
                  },
                  '& .MuiAutocomplete-paper': {
                    backgroundColor: 'red',
                  },
                },
                '& .MuiFormControl-root': {
                  '& .MuiFormLabel-root': {
                    fontFamily: '__Montserrat_bf7f7a',
                    fontSize: '14px',
                    top: '-8px  ',
                    '&.Mui-focused': {
                      top: '0px',
                    },
                  },
                },
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Max"
                  InputLabelProps={{
                    style: {
                      color: '#acacac',
                    },
                  }}
                />
              )}
            />
          </Box>
          <TableContainer
            style={{
              marginTop: '20px',
              width: 609,
              borderRadius: '16px',
              backgroundColor: '#313131',
              border: '1px solid #313131',
            }}
            component={Paper}
          >
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>City</StyledTableCell>
                  <StyledTableCell align="right">
                    Temparature max
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    Temparature min
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    Wind direction
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cityWeather &&
                  cityWeather.map((row, index) => {
                    if (
                      row &&
                      selectCountry.includes(row.daily.country) &&
                      (!selectMinTemp ||
                        row.daily.temperature_2m_min[0] >
                          Number(selectMinTemp)) &&
                      (!selectMaxTemp ||
                        row.daily.temperature_2m_max[0] < Number(selectMaxTemp))
                    ) {
                      return (
                        <StyledTableRow
                          key={index}
                          sx={{
                            minHeight: '0px',
                            height: '30px',
                          }}
                        >
                          <StyledTableCell
                            component="th"
                            scope="row"
                            onClick={() => handleCityClick(row?.daily.cityName)}
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? '#1A1A1A' : '#313131',
                              padding: '8px',
                              cursor: 'pointer',
                            }}
                          >
                            {row?.daily.cityName}
                          </StyledTableCell>
                          <StyledTableCell
                            align="right"
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? '#1A1A1A' : '#313131',
                              padding: '8px',
                            }}
                          >
                            {row?.daily.temperature_2m_max[0]}
                          </StyledTableCell>
                          <StyledTableCell
                            align="right"
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? '#1A1A1A' : '#313131',
                              padding: '8px',
                            }}
                          >
                            {row?.daily.temperature_2m_min[0]}
                          </StyledTableCell>
                          <StyledTableCell
                            align="right"
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? '#1A1A1A' : '#313131',
                              padding: '8px',
                            }}
                          >
                            {row?.daily.winddirection_10m_dominant[0]}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    } else {
                      return null;
                    }
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}
