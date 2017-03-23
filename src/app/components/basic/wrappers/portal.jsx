import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class Portal extends React.Component {

  static propTypes = {
    children: PropTypes.node,
  };

  constructor() {
    super();

    this.node = document.createElement('div');
    document.body.appendChild(this.node);
  }

  componentDidMount() {
    this.renderPortal();
  }

  componentDidUpdate() {
    this.renderPortal();
  }

  componentWillUnmount() {
    document.body.removeChild(this.node);
  }

  renderPortal() {
    ReactDOM.render(
      <div {...this.props}>{ this.props.children }</div>,
      this.node,
    );
  }

  render() {
    return null;
  }

}
