import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import TextEditor from '../components/TextEditor';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #868e96;
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>AI2Human</title>
        <meta name="description" content="Make your writing more human" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>
      <AppContainer>
        <Header>
          <Title>AI2Human</Title>
          <Subtitle>Make your writing more human</Subtitle>
        </Header>
        <TextEditor />
      </AppContainer>
    </>
  );
}