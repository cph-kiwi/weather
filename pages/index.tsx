import Head from "next/head";
import type { NextPage } from "next";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
html {
          box-sizing: border-box;
          background: #ffd1dc;
          font-family: "helvetica neue";
          font-size: 20px;
          font-weight: 200;
          min-height: 100vh;
        }
`;

const Home: NextPage = () => {
  return (
    <div>
      <GlobalStyles />
      <Head>
        <title>Weather App</title>
      </Head>
      <Title>
        <h1>Weather</h1>
      </Title>
    </div>
  );
};

export default Home;

const Title = styled.h1`
  color: #614e55;
  margin: auto;
  width: 50%;
  padding: 10px;
`;
