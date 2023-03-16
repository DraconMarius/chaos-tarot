import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Login from './pages/Login';
import SignUp from './pages/Signup';
import Home from './pages/Home';
import Log from './pages/Log';
import Reading from './pages/Reading';




// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
  // uri: "http://localhost:3001/graphql",
});
// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  // We then use the setContext() method to retrieve an existing token from local storage and attach the JWT token to every request sent from the client.
  // The back end will then use this information to verify the request:
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  //cache so we can store data in the browser
  cache: new InMemoryCache(),
});

function App() {
  // const isLoggedIn = localStorage.getItem('id_token');

  return (
    //applying the ApolloProvider component to the App component, we can then use the useQuery() Hook in any component to make a GraphQL query.
    <ApolloProvider client={client}>
      {/* //router component to handle the navigation between pages */}
      <Router>
        <div>
          {/* <PageContainer> */}
          <NavigateTabs />
          <Routes>
            {/* <Route 
          exact path="/" element={isLoggedIn ? (
          ) : (<Navigate replace to="/login" />)} /> */}
            <Route exact path="/" element={<Home />} />
            <Route exact path="/Reading" element={<Reading />} />
            <Route exact path="/Card" element={<Card />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/log" element={<Log />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/profile" element={<ProfileContainer />} />
          </Routes>
          {/* </PageContainer> */}
        </div>
      </Router>
      <Footer />
    </ApolloProvider>
  );
}

export default App;
