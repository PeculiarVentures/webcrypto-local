import React, { PropTypes } from 'react';
import enLang from '../../../langs/en.json';
import * as DialogStyled from './styled/dialog.styled';

const Dialog = (props) => {
  const {
    title,
    acceptText,
    cancelText,
    acceptFirst,
    disableAccept,
    disableCancel,
    btnAcceptProps,
    btnCancelProps,
    onCancel,
    onAccept,
    children,
    cancelPrimary,
    cancelOnAccept,
  } = props;

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const handleAccept = () => {
    if (cancelOnAccept) {
      handleCancel();
      if (onAccept) onAccept();
    } else if (onAccept) {
      onAccept();
    }
  };

  const renderCancelButton = () => {
    if (cancelText) {
      return (
        <DialogStyled.Btn
          autoFocus
          disabled={disableCancel}
          primary={cancelPrimary}
          {...btnCancelProps}
          onClick={handleCancel}
        >
          { cancelText }
        </DialogStyled.Btn>
      );
    }

    return null;
  };

  const renderAcceptButton = () => {
    if (acceptText) {
      return (
        <DialogStyled.Btn
          disabled={disableAccept}
          onClick={handleAccept}
          primary
          {...btnAcceptProps}
        >
          { acceptText }
        </DialogStyled.Btn>
      );
    }

    return null;
  };

  const renderButtons = () => {
    if (acceptFirst) {
      return (
        <DialogStyled.BtnsContainer>
          { renderAcceptButton() }
          { renderCancelButton() }
        </DialogStyled.BtnsContainer>
      );
    }

    return (
      <DialogStyled.BtnsContainer>
        { renderCancelButton() }
        { renderAcceptButton() }
      </DialogStyled.BtnsContainer>
    );
  };

  return (
    <DialogStyled.Dialog>
      <DialogStyled.Container>
        <DialogStyled.Title>
          { title }
        </DialogStyled.Title>
        { children }
        { renderButtons() }
      </DialogStyled.Container>
    </DialogStyled.Dialog>
  );
};

Dialog.propTypes = {
  title: PropTypes.string,
  acceptText: PropTypes.string,
  cancelText: PropTypes.string,
  disableAccept: PropTypes.bool,
  disableCancel: PropTypes.bool,
  acceptFirst: PropTypes.bool,
  cancelPrimary: PropTypes.bool,
  cancelOnAccept: PropTypes.bool,
  btnAcceptProps: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  btnCancelProps: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  onCancel: PropTypes.func,
  onAccept: PropTypes.func,
  children: PropTypes.node,
};

Dialog.defaultProps = {
  cancelText: enLang['Dialog.Btn.Cancel'],
};

export default Dialog;
