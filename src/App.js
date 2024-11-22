import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import TextEditor from './components/TextEditor';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    overflow-y: scroll;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: #f1f3f5;
    color: #212529;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

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

const App = () => {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Title>AI2Human</Title>
          <Subtitle>Make your writing more human</Subtitle>
        </Header>
        <TextEditor />
      </AppContainer>
    </>
  );
};

export default App;
