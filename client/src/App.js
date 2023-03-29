import React from 'react';

import { BrowserRouter as Router, Route, Routes, Link as RouterLink } from 'react-router-dom';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Auth from "./utils/auth";

//i can't stand light mode tbh
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import styled from '@emotion/styled'

import LogIn from './pages/Login';
import SignUp from './pages/Signup';
import Home from './pages/Home';
import GithubReadme from './pages/About';
import ReadingContainer from './components/ReadingContainer';


// import Log from './pages/Log';
// import Reading from './pages/Reading';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffa733',

    }
  },
});

const logoStyles = ({
  logo: {
    maxHeight: 100,
  },
});

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
  // uri: "http://localhost:3001/graphql",
})
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
  //setting up apollo client and option
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const menuWidth = 300;
  //since we are mapping our nav/appbar item
  const inItems = [{ Tag: "Home", Link: "/" },
  { Tag: "Generate", Link: "/daily" },
  { Tag: "About", Link: "/about" }];
  const outItems = [{ Tag: "Home", Link: "/" },
  { Tag: "Login", Link: "/login" },
  { Tag: "SignUp", Link: "/signup" },
  { Tag: "About", Link: "/about" }]


  //setting state for toggle
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const toggleMenu = () => {
    setMobileOpen((prevState) => !prevState);
  }
  //menu display based on login or not
  const menu = (
    <Box onClick={toggleMenu} sx={{ textAlign: 'center' }}>

      <Typography variant="h6" sx={{ my: 2 }}>
        Chaos Tarot
      </Typography>
      <Divider />

      <List>
        {Auth.loggedIn() ? (

          inItems.map((item) => (
            <ListItem key={item.Tag} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} >
                <Button component={RouterLink} to={item.Link} sx={{ color: '#fff', textDecoration: 'none', width: '100%' }}>
                  <ListItemText primary={item.Tag} />
                </Button>
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          outItems.map((item) => (
            <ListItem key={item.Tag} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} >
                <Button component={RouterLink} to={item.Link} sx={{ color: '#fff', textDecoration: 'none', width: '100%' }}>
                  <ListItemText primary={item.Tag} />
                </Button>
              </ListItemButton>
            </ListItem>)
          ))}
        {Auth.loggedIn() ? (
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary="Logout" onClick={Auth.logout} />
          </ListItemButton>
        ) : (null)}
      </List>
    </Box>
  );
  const container = typeof window !== 'undefined' ? window.document.body : undefined;

  return (
    //wrapping provier to the App component, we can then use the Hooks in any component to make a GraphQL query.
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <AppBar component="nav">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open menu"
                edge="start"
                onClick={toggleMenu}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
              >
                <img
                  src='https://res.cloudinary.com/dbjhly3lm/image/upload/w_70,h_53,c_scale/v1680114110/Chaos%20Tarot%20Logo.png'
                  alt="Chaos-Tarot Logo"
                >
                </img>
                Chaos Tarot
              </Typography>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {Auth.loggedIn() ? (
                  inItems.map((item) => (
                    <Button key={item.Tag} component={RouterLink} to={item.Link} sx={{ color: '#fff' }}>
                      <ListItemText primary={item.Tag} />
                    </Button>
                  ))) : (
                  outItems.map((item) => (
                    <Button key={item.Tag} component={RouterLink} to={item.Link} sx={{ color: '#fff' }}>
                      <ListItemText primary={item.Tag} />
                    </Button>
                  )
                  ))}
                {Auth.loggedIn() ? (
                  <Button sx={{ color: '#fff' }}>
                    <ListItemText primary="Logout" onClick={Auth.logout} />
                  </Button>
                ) : (null)}
              </Box>

            </Toolbar>
          </AppBar>
          <Box component="nav">
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={toggleMenu}
              ModalProps={{
                keepMounted: true, // https://mui.com/material-ui/react-app-bar/
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: menuWidth },
              }}
            >
              {menu}
            </Drawer>
          </Box>
          <Box component="main" sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}>
            <Toolbar />
            {/* //router component to handle the navigation between pages */}
            <div>
              <Container>
                <Routes>
                  <Route exact path="/" element={<Home />} />
                  <Route exact path="/daily" element={<ReadingContainer />} />
                  {/* <Route exact path="/cards" element={<Card />} /> */}
                  <Route exact path="/login" element={<LogIn />} />
                  {/* <Route exact path="/logs" element={<Log />} /> */}
                  <Route exact path="/signup" element={<SignUp />} />
                  <Route exact path="/about" element={<GithubReadme />} />
                </Routes>
              </Container>
            </div>
          </Box>
        </Router>
      </ThemeProvider>
      {/* <Footer /> */}
    </ApolloProvider >
  );
}

export default App;
