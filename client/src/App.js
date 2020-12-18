import React from 'react';
import './App.scss';
import HomePage from './pages/HomePage';
import NotFound from './components/NotFound';
import IntroPage from './pages/IntroPage';
import UserDataCollection from './pages/UserDataCollection';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LowCarbonTravelGame from './games/low-carbon-travel/LowCarbonTravelGame';
import CircularEconomyGame from './games/circular-economy/CircularEconomyGame';
import RetrofitHomesGame from './games/retrofit-homes/RetrofitHomesGame';


const App = () => {

      return (
            <Router>
                  <div className="Layout">
                        <Switch>
                              <Route path="/" exact component={HomePage} />
                              <Route path="/about" ></Route>
                              <Route path="/privacy" ></Route>
                              <Route path="/user" component={UserDataCollection}/>
                              <Route path="/intro" component={IntroPage}/>
                              <Route path="/lowcarbon">
                                    <LowCarbonTravelGame />
                              </Route>
                              <Route path="/circulareconomy">
                                    <CircularEconomyGame />
                              </Route>
                              <Route path="/retrofithomes">
                                    <RetrofitHomesGame />
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
