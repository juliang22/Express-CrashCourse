import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'
import './App.css'; //Important to have this after so that our css can override the template css above (cascading)

import { AuthProvider } from './context/auth'
import AuthRoute from './util/AuthRoute'

import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import MenuBar from './components/MenuBar'

//Can also replace Container with <div className="ui container">
// AuthRoute passes all of those attributes down into the AUthRoute component 
function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
