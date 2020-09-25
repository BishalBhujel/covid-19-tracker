import React,{useState,useEffect} from 'react';
import { MenuItem, FormControl, Select,Card,CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({});

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json()).then((data) => {
        setCountryInfo(data);
        console.log(data);
      })
  },[])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2,
            }));
          
          setCountries(countries);
        });
    };
    
    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
 fetch(url)
      .then((response) => response.json()).then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        console.log( data );
      });
  };

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select
            onChange={onCountryChange}
            varient="outlined"
            value={country}
          >
            <MenuItem value="worldwide">WorldWide</MenuItem>
            {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
            ))
            }
          </Select>
        </FormControl>
      </div>

      <div className="app__stats">
        <InfoBox title="Total Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
        <InfoBox title="Recovered Cases" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
        <InfoBox title="Death" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
      </div>
        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>live cases by country</h3>
          <h3>worldwide new cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
