import React, { PropTypes, Component } from 'react';
import { Button } from '../basic';
import SubjectInfo from './parts/subject_info';
import KeyInfo from './parts/key_info';
import Provider from './parts/provider';
import SelfSigned from './parts/self_signed';
import enLang from '../../langs/en.json';
import countriesData from '../../constants/countries.json';
import parametersData from '../../constants/parameters.json';
import * as BodyStyled from './styled/body.styled';

export default class Body extends Component {

  static propTypes = {
    parameters: PropTypes.oneOfType([
      PropTypes.object,
    ]),
    countries: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    onCancel: PropTypes.func,
    onCreate: PropTypes.func,
    loaded: PropTypes.bool,
    status: PropTypes.string,
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    countries: countriesData,
    parameters: parametersData,
    loaded: false,
    status: 'seaching',
    onCancel: null,
    onCreate: null,
    providers: [],
    readOnly: false,
  };

  constructor() {
    super();

    this.state = {
      createDisabled: true,
    };
  }

  onCreateHandler = () => {
    const { onCreate } = this.props;
    const { subjectNode, keyNode, signedNode } = this;
    const subjectInfoValid = subjectNode.isValidFields();
    const keyInfoValid = keyNode.isValidFields();
    const selfSigned = signedNode.getData().selfSigned;

    if (subjectInfoValid && keyInfoValid) {
      const subjectInfoData = subjectNode.getData();
      const keyInfoData = keyNode.getData();
      const data = Object.assign(subjectInfoData, keyInfoData);

      if (onCreate) {
        onCreate(data, selfSigned === 'yes');
      }
    } else {
      this.createDisabledHandler(true);
    }
  };

  onCancelHandler = () => {
    const { onCancel } = this.props;
    if (onCancel) onCancel();
  };

  onValidateHandler = () => {
    const { subjectNode } = this;
    const subjectInfoValid = subjectNode.isValidFields();
    this.createDisabledHandler(!subjectInfoValid);
  };

  createDisabledHandler = (status) => {
    this.setState({
      createDisabled: status,
    });
  };

  render() {
    const { countries, parameters, loaded, status, providers, readOnly } = this.props;
    const { createDisabled } = this.state;
    const btnCreateDisabled = !loaded || status !== 'online' || readOnly || createDisabled;

    return (
      <BodyStyled.Body>
        <BodyStyled.Container>
          <Provider
            providers={providers}
          />
          <SubjectInfo
            countries={countries}
            ref={node => (this.subjectNode = node)}
            onValidate={this.onValidateHandler}
            onCreate={this.onCreateHandler}
          />
          <KeyInfo
            parameters={parameters}
            ref={node => (this.keyNode = node)}
          />
          <SelfSigned
            ref={node => (this.signedNode = node)}
          />
          <BodyStyled.BtnsContainer>
            <Button
              onClick={this.onCancelHandler}
            >
              { enLang['CertificateCreate.Btn.Cancel'] }
            </Button>
            <BodyStyled.Btn
              primary
              onClick={this.onCreateHandler}
              disabled={btnCreateDisabled}
            >
              { enLang['CertificateCreate.Btn.Create'] }
            </BodyStyled.Btn>
          </BodyStyled.BtnsContainer>
        </BodyStyled.Container>
      </BodyStyled.Body>
    );
  }
}
