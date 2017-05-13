import React, { Component, PropTypes } from 'react';

// Task component - represents a single todo item
export default class Show extends Component {
  getTorrentLink() {
    let that = this;
    Meteor.call("extratorrentSearch", that.props.show.qs, function(err,result) {
       that.props.show.link = result;
       that.forceUpdate();
    }
   );
  }
  render() {
    this.getTorrentLink(this.props.show.qs);
    return (
      <li>
        <p>{this.props.show.name}</p>
        {this.props.show.link ? this.renderLink() : this.renderLoading()}
      </li>
    );
  }
  renderLink() {
    return (
      <a href={this.props.show.link}>Download</a>
    );
  }
  renderLoading() {
    return (
      this.props.show.link === null ? 'No results' : 'Loading link...'
    );
  }
}

Show.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  show: PropTypes.object.isRequired,
};
