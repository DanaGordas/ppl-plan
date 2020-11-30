import React from 'react';
import classes from './App.scss';
import HomePage from './pages/HomePage';
import NotFound from './components/NotFound';
import UserDataCollection from './pages/UserDataCollection';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LowCarbonGame from './games/low-carbon-travel/LowCarbonGame';


const App = () => {

      return (
            <Router>
                  <div className={classes.Layout}>
                        <Switch>
                              <Route path="/" exact component={HomePage} />
                              <Route path="/about" ></Route>
                              <Route path="/privacy" ></Route>
                              <Route path="/user" component={UserDataCollection}/>
                              <Route path="/lowcarbon">
                                    <LowCarbonGame />
                              </Route>
                              <Route>
                                    <NotFound />
                              </Route>
                        </Switch>     
                  </div>
            </Router>
      )
}

export default App;
