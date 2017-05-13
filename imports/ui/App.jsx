import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
// import { Tasks } from '../api/tasks.js';
// import Task from './Task.jsx';
import Show from './Show.jsx';
// App component - represents the whole app
class App extends Component {

  // renderTasks() {
  //   return this.props.tasks.map((task) => (
  //     <Task key={task._id} task={task} />
  //   ));
  // }

  getShows() {
    return [
      {
        _id: 1,
        name: 'Scandal',
        qs: 'scandal%20s04e10'
      }
    ];
  }

  renderShows() {
    return this.props.shows.map((show) => (
      <Show key={show._id} show={show} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Shows</h1>
        </header>

        <ul>
          {this.renderShows()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  // tasks: PropTypes.array.isRequired,
  shows: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    shows: [
      {
        _id: 1,
        name: 'Scandal',
        qs: 'scandal%20s04e10'
      }
    ]
  };
}, App);
