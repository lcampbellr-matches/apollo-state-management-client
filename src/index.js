import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  makeVar,
} from "@apollo/client";


const movie = makeVar({});
const book = makeVar({});
const user = makeVar({});

const localState = {
  movie,
  book,
  user
};

export const AppContext = React.createContext(localState);

const cache = new InMemoryCache({
  typePolicies: {
    Book: {
      keyFields:['title']
    },
    Movie: {
      keyFields:['title']
    },
    User: {
      keyFields:['title']
    },
  }
})

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache,
});


ReactDOM.render(
  <AppContext.Provider value={localState}>
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
  </AppContext.Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
