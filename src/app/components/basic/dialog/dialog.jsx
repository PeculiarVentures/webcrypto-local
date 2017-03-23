import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { Button } from '../button';

const ButtonStyled = styled(Button)`
  margin-left: 10px;
  &:first-child {
    margin-left: 0;
  }
  @media ${props => props.theme.media.mobile} {
    margin-left: 8px;
  }
`;

const BtnsContainer = styled.div`
  margin-top: 36px;
  @media ${props => props.theme.media.mobile} {
    margin-top: 32px;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.036em;
  color: ${props => props.theme.dialog.color};
  line-height: 24px;
  @media ${props => props.theme.media.mobile} {
    font-size: 15px;
    line-height: 21px;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${props => props.theme.dialog.background};
  border: 1px solid ${props => props.theme.dialog.borderColor};
  border-radius: ${props => props.theme.borderRadius}px;
  display: inline-block;
  padding: 88px 70px 86px;
  vertical-align: middle;
  @media ${props => props.theme.media.mobile} {
    width: calc(100% - 20px);
    padding: 50px 30px 46px;
  }
`;

const DialogStyled = styled.div`
  width: 100%;
  text-align: center;
  height: 100%;
  z-index: 10;
  padding: 30px 0;
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
  background: ${props => props.theme.dialog.backgroundOverlay};
  animation: ${props => props.theme.mixins.fadeIn} ${props => props.theme.basicTransition}ms;
  ${props => props.theme.mixins.ghostVerticalAlign}
`;

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
        <ButtonStyled
          autoFocus
          disabled={disableCancel}
          primary={cancelPrimary}
          {...btnCancelProps}
          onClick={handleCancel}
        >
          { cancelText }
        </ButtonStyled>
      );
    }

    return null;
  };

  const renderAcceptButton = () => {
    if (acceptText) {
      return (
        <ButtonStyled
          disabled={disableAccept}
          onClick={handleAccept}
          {...btnAcceptProps}
        >
          { acceptText }
        </ButtonStyled>
      );
    }

    return null;
  };

  const renderButtons = () => {
    if (acceptFirst) {
      return (
        <BtnsContainer>
          { renderAcceptButton() }
          { renderCancelButton() }
        </BtnsContainer>
      );
    }

    return (
      <BtnsContainer>
        { renderCancelButton() }
        { renderAcceptButton() }
      </BtnsContainer>
    );
  };

  return (
    <DialogStyled>
      <Container>
        <Title>
          { title }
        </Title>
        { children }
        { renderButtons() }
      </Container>
    </DialogStyled>
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
  cancelText: 'Cancel',
  cancelOnAccept: true,
  acceptFirst: true,
  cancelPrimary: true,
};

export default Dialog;
