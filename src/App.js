import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Movie from './components/Movie';
import Register from './components/Register';
import Profile from './components/Profile';
import Search from './components/Search';
import Help from './components/Help';
import Query from './components/Query';
import MyList from './components/MyList';
import Popular from './components/Popular';

function App(props) {
  
  return (
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/movies/:id' component={Movie} />
        <Route path='/register' exact component={Register} />
        <Route path='/profile/:id' exact component={Profile} />
        <Route path='/search' exact component={Search} />
        <Route path='/help' exact component={Help} />
        <Route path='/query' exact component={Query} />
        <Route path='/my-list' exact component={MyList} />
        <Route path='/popular' exact component={Popular} />
        <Route path="/" render={props =>
          <>
            <div>404: Not Found</div>
            <button onClick={_=> props.history.push('/')}>Back to Home</button>
          </>
        } />
      </Switch>
  );
}

export default App
