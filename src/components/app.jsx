import React from 'react';
import styles from './app.css';

export default class App extends React.Component {
  render() {
    return (
      <div>
      	<h1 className={styles.heading}>Hello!</h1>
      	<p>This is react and css modules in webpack</p>
      </div>
    );
  }
}