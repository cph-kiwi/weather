import Head from "next/head";
import type { NextPage } from "next";
import styled, { createGlobalStyle } from "styled-components";

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

const Home: NextPage = () => {
  return (
    <Container>
      <GlobalStyles />
      <Head>
        <title>Weather App</title>
      </Head>
      <Title>Weather</Title>
    </Container>
  );
};

export default Home;

const Container = styled.div`
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
