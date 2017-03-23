import React, { PropTypes } from 'react';

export default class OfflineHandler extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor() {
    super();
    this.state = {
      online: navigator.onLine,
    };
  }

  componentDidMount() {
    this.bindEvents();
  }

  componentWillUnmount() {
    this.unbindEvents();
  }

  bindEvents() {
    const onChange = () => {
      this.setState({
        online: navigator.onLine,
      });
    };

    window.addEventListener('online', onChange, false);
    window.addEventListener('offline', onChange, false);

    this.unbindEvents = () => {
      window.removeEventListener('online', onChange, false);
      window.removeEventListener('offline', onChange, false);
    };
  }

  render() {
    const { children } = this.props;
    const { online } = this.state;

    if (!online) {
      if (children) {
        return children;
      }
      throw new Error('Children not found in <OfflineHandler/>');
    } else {
      return null;
    }
  }
}
