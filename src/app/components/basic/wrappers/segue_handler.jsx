import React, { PropTypes } from 'react';

export default class SegueHandler extends React.Component {

  static propTypes = {
    query: PropTypes.string,
    default: PropTypes.string,
    children: PropTypes.node,
  };

  getDefaultContent() {
    const { children } = this.props;

    if (this.props.default) {
      for (const item of children) {
        if (item.props.name === this.props.default) {
          return item;
        }
      }

      throw new Error('Default query of the <SegueHandler> is wrong.');
    }

    return null;
  }

  getContent() {
    let { children, query } = this.props;
    children = [].concat(children);

    if (children.length) {
      for (const item of children) {
        if (item.props.name === query) {
          return item;
        }
      }
    }

    return this.getDefaultContent();
  }

  cloneExtendingProps(component) {
    return React.cloneElement(component, this.props.omit('className', 'children'));
  }

  cloneWithoutExtendingProps(component) {
    return React.cloneElement(component);
  }

  render() {
    const page = this.getContent();
    let clonedPage = null;

    if (page) {
      clonedPage = page.props.notExtendProps
        ? this.cloneWithoutExtendingProps(page)
        : this.cloneExtendingProps(page);
    }

    if (clonedPage) {
      return (
        clonedPage
      );
    }

    return null;
  }

}
