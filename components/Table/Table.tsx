'use client';
import { Box } from '@mui/material';
import style from './table.module.scss';

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

import citiesData from '../../data/cities.json';

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

const autocompleteSx = {
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
};

interface TableProps {
  cityWeather: Array<WeatherData | null>;
  selectCountry: string[];
  selectMinTemp: number | null;
  selectMaxTemp: number | null;
  handleCityClick: (value: string) => void;
  filterCountry: (value: string[]) => void;
  filterMinTemp: (value: number | null) => void;
  filterMaxTemp: (value: number | null) => void;
}

interface WeatherData {
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    winddirection_10m_dominant: number[];
    cityName: string;
    country: string;
  };
}

const Tables = ({
  cityWeather,
  selectCountry,
  selectMinTemp,
  selectMaxTemp,
  handleCityClick,
  filterCountry,
  filterMaxTemp,
  filterMinTemp,
}: TableProps) => {
  return (
    <Box className={style.tableContainer}>
      <Box className={style.filter}>
        <Autocomplete
          multiple
          onChange={(event, value) => filterCountry(value)}
          options={citiesData
            .map(optionName => optionName.country)
            .filter((value, index, self) => self.indexOf(value) === index)}
          sx={autocompleteSx}
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
          options={Array.from({ length: 33 }, (_, index) => index * 5 - 80)} // Отримання опцій від -80 до 80 з кроком 5
          onChange={(event, value) => filterMinTemp(value)}
          sx={autocompleteSx}
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
          options={Array.from({ length: 33 }, (_, index) => index * 5 - 80)} // Отримання опцій від -80 до 80 з кроком 5
          onChange={(event, value) => filterMaxTemp(value)}
          sx={autocompleteSx}
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
              <StyledTableCell align="right">Temparature max</StyledTableCell>
              <StyledTableCell align="right">Temparature min</StyledTableCell>
              <StyledTableCell align="right">Wind direction</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cityWeather &&
              cityWeather.map((row, index) => {
                if (
                  row &&
                  selectCountry.includes(row.daily.country) &&
                  (!selectMinTemp ||
                    row.daily.temperature_2m_min[0] > Number(selectMinTemp)) &&
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
  );
};

export default Tables;
