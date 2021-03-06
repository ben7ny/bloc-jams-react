import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import Library from './components/Library';
import Album from './components/Album';


class App extends Component {
  render() {
    return (
      <div className="App">
      <header>

        <nav className="myNav">
          <ul className="navList">
            <li className="navItem"><Link to='/'>Landing</Link></li>
            <li className="navItem"><Link to='/library'>Library</Link></li>
          </ul>
          <div className="blocJam-logo"><Link to='/'> <img className="bj-logo" src="/assets/images/bloc_jams_logo.png" alt="logo"/></Link></div>
        </nav>
       </header>
       <main>
          <Route exact path="/" component={Landing} />
          <Route path="/library" component={Library} />
          <Route path="/album/:slug" component={Album} />
       </main>
      </div>
    );
  }
}

export default App;
