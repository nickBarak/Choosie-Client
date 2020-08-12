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
import { transitionPage } from './Functions';

function App() {
  
  return (
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/movies/:id' component={Movie} />
        <Route path='/register' exact component={Register} />
        <Route path='/profile/:username' exact component={Profile} />
        <Route path='/search' exact component={Search} />
        <Route path='/help' exact component={Help} />
        <Route path='/query' exact component={Query} />
        <Route path='/my-list' exact component={MyList} />
        <Route path='/popular' exact component={Popular} />
        <Route path="/" render={({ history, location }) => {
          
          document.getElementById('root').style.opacity = 1;

          return (
            <>
                <div style={{ margin: '1rem 0 .25rem 1rem' }}>You must be logged in as "{location.pathname.split('/profile/')[1]}" to view this page</div>
                <button style={{ marginTop: '.5rem' }} onMouseOver={e => {
                    e.target.style.backgroundColor = 'var(--bg-color-light)';
                    e.target.style.color = 'var(--color-offset)';
                }} onFocus={e => {
                    e.target.style.backgroundColor = 'var(--bg-color-light)';
                    e.target.style.color = 'var(--color-offset)';
                }} onMouseOut={e => {
                    e.target.style.backgroundColor = 'var(--color-offset)';
                    e.target.style.color = 'var(--bg-color-dark)'
                }} onBlur={e => {
                    e.target.style.backgroundColor = 'var(--color-offset)';
                    e.target.style.color = 'var(--bg-color-dark)'
                }} className="button" onClick={_=> transitionPage(history, '/')}>Back to Home</button>
            </>
        )
      }} />
      </Switch>
  );
}

export default App
