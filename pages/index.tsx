import Head from "next/head";
import type { NextPage } from "next";
import styled, { createGlobalStyle } from "styled-components";
import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";

const GlobalStyles = createGlobalStyle`
html {
  min-height: 100%;
        }
body {
          box-sizing: border-box;
          background: #ffd1dc;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 20px;
          font-weight: 200;
        }
`;

type clouds = {
  all: number;
};

type wind = {
  speed: number;
};

type weather = {
  main: string;
  description: string;
  icon: string;
};

type weatherHour = {
  main: main;
  weather: [weather]; // tuple
  wind: wind;
  clouds: clouds;
};

type main = {
  humidity: number;
  temp: number;
};

type sys = {
  sunrise: number;
  sunset: number;
};

type cityData = {
  name: string;
  main: main;
  weather: [weather]; // tuple
  wind: wind;
  clouds: clouds;
  sys: sys;
  timezone: number;
};

type cityForecast = {
  list: weatherHour[];
};

const Home: NextPage = () => {
  const apiKey = "088fa901df58c5e65281cdffd7c8d1a9";
  const toCelsius = "&units=metric";

  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [cityData, setCityData] = useState<cityData | undefined>(undefined);
  const [cityForecast, setCityForecast] = useState<cityForecast | undefined>(
    undefined
  );
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [error, setError] = useState("");

  function translateTime(time: number, timezone: number) {
    const DateObject = new Date(time * 1000);
    const dt = DateTime.fromJSDate(DateObject, {
      zone: "utc",
    }).plus({ second: timezone });
    return dt;
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
    } else {
      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          setIsLoading(true);

          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}${toCelsius}`
          )
            .then((response) => response.json())
            .then((result) => {
              console.log(result);
              setCityData(result);
              setIsLoading(false);
            });
        },
        () => {
          setError("Unable to retrieve your location");
        }
      );
      setIsLocating(false);
    }
  }, []);

  return (
    <Container>
      <GlobalStyles />
      <Head>
        <title>Weather App</title>
      </Head>
      <Title>Weather</Title>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          setIsLoading(true);
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}${toCelsius}`
          )
            .then((response) => response.json())
            .then((result) => {
              console.log("current weather", result);
              setCityData(result);
              setIsLoading(false);
              setCityInput("");
              setLocation({ latitude: 0, longitude: 0 });
            });

          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}${toCelsius}`
          )
            .then((response) => response.json())
            .then((result) => {
              console.log("forecast", result);
              setCityForecast(result);
            });
        }}
      >
        <Input
          id="city-input"
          placeholder="City name"
          type="text"
          value={cityInput}
          onChange={(event) => {
            setCityInput(event.target.value);
          }}
        ></Input>
        <Button id="button" type="submit">
          Submit
        </Button>
      </Form>

      {isLoading && <p>Loading...</p>}
      {error !== "" && <p>{error}</p>}
      {isLocating && <p>Locating...</p>}
      {location.latitude !== 0 && (
        <CityDetail>
          Your location: latitude: {location.latitude}, longitude:{" "}
          {location.longitude}
        </CityDetail>
      )}
      {cityData !== undefined && (
        <CityContainer>
          <CityName>{cityData.name}</CityName>
          <CityDetail>
            {cityData.weather[0].main} {Math.round(cityData.main.temp)}°C
          </CityDetail>
          <WeatherIcon
            src={`https://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`}
          />
          <CityDetail>
            Description: {cityData.weather[0].description}
          </CityDetail>
          <CityDetail>Wind speed: {cityData.wind.speed} meter/sec</CityDetail>
          <CityDetail>Cloudiness: {cityData.clouds.all}%</CityDetail>
          <CityDetail>Humidity: {cityData.main.humidity}%</CityDetail>
          <CityDetail>
            Sunrise:{" "}
            {translateTime(cityData.sys.sunrise, cityData.timezone).hour}:
            {translateTime(cityData.sys.sunrise, cityData.timezone).minute}:
            {translateTime(cityData.sys.sunrise, cityData.timezone).second}
          </CityDetail>
          <CityDetail>
            Sunset: {translateTime(cityData.sys.sunset, cityData.timezone).hour}
            :{translateTime(cityData.sys.sunset, cityData.timezone).minute}:
            {translateTime(cityData.sys.sunset, cityData.timezone).second}
          </CityDetail>
        </CityContainer>
      )}
      {cityForecast !== undefined && (
        <CityContainer>
          <CityForecast>24 hour Forecast</CityForecast>
          <CityDetail>
            {cityForecast.list[8].weather[0].main}{" "}
            {Math.round(cityForecast.list[8].main.temp)}°C
          </CityDetail>
          <WeatherIcon
            src={`https://openweathermap.org/img/wn/${cityForecast.list[8].weather[0].icon}@2x.png`}
          />
          <CityDetail>
            Description: {cityForecast.list[8].weather[0].description}
          </CityDetail>
          <CityDetail>
            Wind speed: {cityForecast.list[8].wind.speed} meter/sec
          </CityDetail>
          <CityDetail>
            Cloudiness: {cityForecast.list[8].clouds.all}%
          </CityDetail>
          <CityDetail>
            Humidity: {cityForecast.list[8].main.humidity}%
          </CityDetail>
        </CityContainer>
      )}
    </Container>
  );
};

export default Home;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CityContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: #614e55;
  font-size: 80px;
  font-weight: 800;
  margin: 100px 0px 0px 0px;
  padding: 0px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  width: 300px;
  margin: 30px 0px 0px 0px;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid #614e55;
  color: black;
`;

const Button = styled.button`
  border-radius: 8px;
  background: #f7cac9;
  box-shadow: 8px 8px 8px #cfaaa9, -8px -8px 8px #ffeae9;
  border: 1px solid #614e55;
  width: 200px;
  margin-top: 40px;
  margin-bottom: 40px;
  padding: 8px 16px;
`;

const CityName = styled.h2`
  color: #614e55;
  font-weight: 800;
  margin-top: 10px;
`;

const CityForecast = styled.h2`
  color: #614e55;
  font-weight: 800;
`;

const CityDetail = styled.h4`
  color: #614e55;
  font-weight: 200;
  margin: 10px 0 0px 0;
`;

const WeatherIcon = styled.img``;
