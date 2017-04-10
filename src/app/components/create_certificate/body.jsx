import React, { PropTypes, Component } from 'react';
import { Button } from '../basic';
import SubjectInfo from './parts/subject_info';
import KeyInfo from './parts/key_info';
import Provider from './parts/provider';
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
    dataLoaded: PropTypes.bool,
    serverStatus: PropTypes.string,
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    countries: countriesData,
    parameters: parametersData,
    dataLoaded: false,
    serverStatus: 'seaching',
    onCancel: null,
    onCreate: null,
    providers: [],
    readOnly: false,
  };

  onCreateHandler = () => {
    const { onCreate } = this.props;
    const { subjectNode, keyNode } = this;
    const subjectInfoValid = subjectNode.isValidFields();
    const keyInfoValid = keyNode.isValidFields();

    if (subjectInfoValid && keyInfoValid) {
      const subjectInfoData = subjectNode.getData();
      const keyInfoData = keyNode.getData();
      const data = Object.assign(subjectInfoData, keyInfoData);

      if (onCreate) onCreate(data);
    }
  };

  onCancelHandler = () => {
    const { onCancel } = this.props;
    if (onCancel) onCancel();
  };

  render() {
    const { countries, parameters, dataLoaded, serverStatus, providers, readOnly } = this.props;

    return (
      <BodyStyled.Body>
        <BodyStyled.Container>
          <Provider
            providers={providers}
          />
          <SubjectInfo
            countries={countries}
            ref={node => (this.subjectNode = node)}
          />
          <KeyInfo
            parameters={parameters}
            ref={node => (this.keyNode = node)}
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
              disabled={!dataLoaded || serverStatus !== 'online' || readOnly}
            >
              { enLang['CertificateCreate.Btn.Create'] }
            </BodyStyled.Btn>
          </BodyStyled.BtnsContainer>
        </BodyStyled.Container>
      </BodyStyled.Body>
    );
  }
}
