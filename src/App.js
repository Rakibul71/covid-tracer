import "./App.css";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";

function App() {
  // https://disease.sh/v3/covid-19/countries

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setTableData(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // console.log(countryCode);
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries/[countryCode]
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };
  console.log(countryInfo);
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">worldwide</MenuItem>
              {countries.map((country) => {
                return (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          ></InfoBox>
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          ></InfoBox>
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          ></InfoBox>
        </div>
        <Map></Map>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live class by Country</h3>
          {/* <Table countries={tableData} /> */}
          <Table countries={tableData}></Table>
          <h3 className="app__graphTitle">World wide new case type</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
