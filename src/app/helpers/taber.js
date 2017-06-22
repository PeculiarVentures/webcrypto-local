/* eslint-disable */
export default class Taber {

  constructor(props = {}) {
    const defaultProps = {
      autoFocusRootNode: true,
    };

    this.props = { ...Object.assign({}, defaultProps, props) };

    this.checkRequiredProps();

    this.initListeners();
    this.init();

    this.keys = {
      shift: false,
      tab: false,
    };
  }

  checkRequiredProps() {
    const { rootNode } = this.props;

    if (!rootNode) {
      throw new Error('<Taber> should have defined rootNode property(DOM Node)');
    }

    if (!rootNode.nodeName || !rootNode.nodeType) {
      throw new Error('<Taber> \'rootNode\' property should be DOM Node');
    }
  }

  initListeners() {
    this.props.rootNode.addEventListener('keydown', ::this.onKeyDown);
    this.props.rootNode.addEventListener('keyup', ::this.onKeyUp);
  }

  init() {
    const { autoFocusRootNode } = this.props;

    this.props.rootNode.tabIndex = -1;

    if (autoFocusRootNode) {
      this.props.rootNode.focus();
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 9) {
      if (e.shiftKey) {
        this.keys.shift = true;
      }

      this.keys.tab = true;
      e.stopPropagation();
      e.preventDefault();
    }

    this.triggerFocus();
  }

  triggerFocus() {
    if (this.keys.shift && this.keys.tab) {
      this.clearKeysHistory();
      return this.focusPrev();
    }

    if (this.keys.tab) {
      this.clearKeysHistory();
      return this.focusNext();
    }
  }

  clearKeysHistory() {
    for (const key in this.keys) {
      this.keys[key] = false;
    }
  }

  onKeyUp(e) {
    if (e.keyCode === 9) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  getParentsNode(node) {
    const parents = [];

    let currentElement = node;


    while (currentElement !== document.body && currentElement.parentNode) {
      parents.push(currentElement.parentNode);
      currentElement = currentElement.parentNode;
    }

    return parents;
  }

  filterHiddenNodes(nodesList) {
    const futureArray = [];

    const checkForHiddenStyles = (node) => {
      const computedStyles = window.getComputedStyle(node);
      const visibilityStyle = computedStyles.visibility;
      const displayStyle = computedStyles.display;

      if (visibilityStyle === 'hidden') {
        return true;
      }

      if (displayStyle === 'none') {
        return true;
      }

      return false;
    };

    nodesList.forEach((node) => {
      let hidden = false;
      const parentNodes = this.getParentsNode(node);
      parentNodes.forEach((parentNode) => {
        if (hidden === false) {
          if (checkForHiddenStyles(parentNode)) {
            hidden = true;
          }
        }
      });

      if (!hidden) {
        futureArray.push(node);
      }
    });

    return futureArray;
  }

  filterDisabledNodes(nodesList) {
    const futureArray = [];

    nodesList.forEach((node) => {
      const attributes = node.attributes;

      if (!attributes.disabled) {
        futureArray.push(node);
      }
    });

    return futureArray;
  }

  filterNegativeTabIndex(nodesList) {
    const futureArray = [];

    nodesList.forEach((node) => {
      const attributes = node.attributes;
      const value = Number(attributes.tabindex.value);

      if (value => 0) {
        futureArray.push(node);
      }
    });

    return futureArray;
  }

  getTabArray() {
    const { rootNode } = this.props;
    let tabIndexNodes = rootNode.querySelectorAll('[tabindex]');
    tabIndexNodes = this.filterDisabledNodes(tabIndexNodes);
    tabIndexNodes = this.filterNegativeTabIndex(tabIndexNodes);
    tabIndexNodes = this.filterHiddenNodes(tabIndexNodes);

    return tabIndexNodes;
  }

  focusPrev() {
    const tabArray = this.getTabArray();

    let nextKey = tabArray.length - 1;

    tabArray.forEach((node, key) => {
      if (tabArray[key] === document.activeElement) {
        if (key !== 0) {
          nextKey = key - 1;
        }
      }
    });

    tabArray[nextKey].focus();
  }

  focusNext() {
    const tabArray = this.getTabArray();

    let nextKey = 0;

    tabArray.forEach((node, key) => {
      if (tabArray[key] === document.activeElement) {
        if (key !== tabArray.length - 1) {
          nextKey = key + 1;
        }
      }
    });

    tabArray[nextKey].focus();
  }

}
