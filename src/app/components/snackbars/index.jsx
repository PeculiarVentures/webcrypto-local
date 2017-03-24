import React, { PropTypes } from 'react';
import { SegueHandler, Snackbar } from '../basic';
import { EventChannel } from '../../controllers';
import { ModalActions } from '../../actions/ui';
import { ACTIONS_CONST } from '../../constants';
import enLang from '../../langs/en.json';

export default class Snackbars extends React.Component {

  static contextTypes = {
    windowSize: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor() {
    super();

    window.EventChannel = EventChannel;

    this.state = {
      type: '',
      message: '',
      params: {},
      duration: 3000,
    };

    this.delay = null;

    this.bindedShow = ::this.show;
    this.bindedHide = ::this.hide;
    this.bindedSetHideTimeout = ::this.setHideTimeout;
    this.bindedSetMessage = ::this.setMesssage;
    this.bindedResetDelay = ::this.resetDelay;

    EventChannel.on(ACTIONS_CONST.SNACKBAR_SET_MESSAGE, this.bindedSetMessage);
    EventChannel.on(ACTIONS_CONST.SNACKBAR_SHOW, this.bindedShow);
    EventChannel.on(ACTIONS_CONST.SNACKBAR_HIDE, this.bindedHide);
    EventChannel.on(ACTIONS_CONST.SNACKBAR_CLEAR_DELAY, this.bindedResetDelay);
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimeout);
  }

  setMesssage(message = '') {
    this.setState({
      message,
    });
  }

  setHideTimeout(timeout) {
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(::this.hide, timeout);
  }

  handleAction(payload) {
    const { type, value } = payload;
    const { dispatch } = this.context;

    switch (type) {

      case ACTIONS_CONST.MODAL_OPEN:
        dispatch(ModalActions.openModal(value));
        break;

      default:
        return null;

    }

    return null;
  }

  resetDelay() {
    if (this.delay) {
      clearTimeout(this.delay);
    }
  }

  show(type, time = 3000, delay, params) {
    const show = () => {
      this.setState({
        type,
        params,
        duration: time,
      });
      if (Number.isFinite(time)) {
        this.setHideTimeout(time);
      }
    };
    if (delay) {
      this.delay = setTimeout(show, delay);
    } else {
      this.resetDelay();
      show();
    }
  }

  hide(type) {
    if (typeof type === 'string' && type !== this.state.type) {
      return false;
    }
    clearTimeout(this.hideTimeout);

    return this.setState({
      type: '',
      message: '',
      params: {},
    });
  }

  render() {
    const {type, message, params, duration} = this.state;
    return (
      <SegueHandler
        query={type}
        name="Snackbars"
        onClose={this.bindedHide}
        transitionGroupEnable
        offset="16px"
        overflowWrapperStyle={{ zIndex: 4 }}
        onMouseOver={() => { clearTimeout(this.hideTimeout); }}
        onMouseLeave={
          () => (Number.isFinite(duration) ? this.bindedSetHideTimeout(duration) : null)
        }
      >
        <Snackbar
          type="error"
          name="offline"
          buttonText={enLang['Snackbar.Offline.Btn.Get']}
          onButtonClick={() => console.log('click Get help button')}
          text={enLang['Snackbar.Offline.Text']}
        />
        <Snackbar
          name="copied"
          buttonText={enLang['Snackbar.Copy.Btn.Close']}
          onButtonClick={() => EventChannel.emit(ACTIONS_CONST.SNACKBAR_HIDE)}
          text={enLang['Snackbar.Copy.Text']}
        />
      </SegueHandler>
    );
  }
}
