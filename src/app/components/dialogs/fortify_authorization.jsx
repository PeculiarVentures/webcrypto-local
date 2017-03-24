import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Dialog } from '../basic';
import { QShortcuts } from '../../controllers';
import enLang from '../../langs/en.json';

const NumberStyled = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 24px;
  line-height: 26px;
  border: 1px solid ${props => props.theme.dialog.authorization.borderColorNumber};
  border-radius: ${props => props.theme.borderRadius}px;
  font-size: 12px;
  margin-left: 2px;
  color: ${props => props.theme.dialog.color};
  &:first-child {
    margin-left: 0;
  }
`;

const NumbersContainerStyled = styled.div`
  margin-top: 16px;
  text-align: center;
`;

const DescrStyled = styled.div`
  font-size: 11px;
  line-height: 18px;
  margin-top: 24px;
  color: ${props => props.theme.dialog.colorDescr};
`;

export default class FortifyAuthorizationDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    numbers: PropTypes.arrayOf(PropTypes.number),
  };

  constructor() {
    super();
    this.unbind = () => {};
  }

  componentDidMount() {
    const { onCancel } = this.props;
    QShortcuts.on('ESCAPE', onCancel);

    this.unbind = () => {
      QShortcuts.off('ESCAPE', onCancel);
    };
  }

  componentWillUnmount() {
    this.unbind();
  }

  render() {
    const { onAccept, onCancel, numbers } = this.props;

    return (
      <Dialog
        title={enLang['Dialog.FortifyAuthorization.Title']}
        acceptText={enLang['Dialog.FortifyAuthorization.Btn.Accept']}
        cancelText={enLang['Dialog.FortifyAuthorization.Btn.Cancel']}
        onAccept={onAccept}
        onCancel={onCancel}
      >
        <DescrStyled>
          { enLang['Dialog.FortifyAuthorization.Description'] }
        </DescrStyled>
        <NumbersContainerStyled>
          {
            numbers.map((number, index) => (
              <NumberStyled
                key={index}
              >
                { number }
              </NumberStyled>
            ))
          }
        </NumbersContainerStyled>
      </Dialog>
    );
  }
}
