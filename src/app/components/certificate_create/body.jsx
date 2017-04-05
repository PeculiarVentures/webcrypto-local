import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Button } from '../basic';
import SubjectInfo from './parts/subject_info';
import KeyInfo from './parts/key_info';
import Provider from './parts/provider';
import enLang from '../../langs/en.json';
import countriesData from '../../constants/countries.json';
import parametersData from '../../constants/parameters.json';

const BtnsContainer = styled.div`
  text-align: center;
  font-size: 0;
  margin-top: 55px;
  @media ${props => props.theme.media.mobile} {
    margin-top: 26px;
  }
`;

const ButtonStyled = styled(Button)`
  margin-left: 10px;
  @media ${props => props.theme.media.mobile} {
    margin-left: 8px;
  }
`;

const Container = styled.div`
  max-width: 890px;
  padding: 0 10px;
  margin: 0 auto;
  @media ${props => props.theme.media.mobile} {
    padding: 0 20px;
  }
`;

const CertificateCreateBodyStyled = styled.div`
  height: calc(100% - 84px);
  overflow: auto;
  padding: 75px 0 80px;
  @media ${props => props.theme.media.mobile} {
    height: calc(100% - 56px);
    padding: 36px 0;
  }
`;

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
  };

  static defaultProps = {
    countries: countriesData,
    parameters: parametersData,
    dataLoaded: false,
    serverStatus: 'seaching',
    onCancel: null,
    onCreate: null,
    providers: [],
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
    const { countries, parameters, dataLoaded, serverStatus, providers } = this.props;

    return (
      <CertificateCreateBodyStyled>
        <Container>
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
          <BtnsContainer>
            <Button
              onClick={this.onCancelHandler}
            >
              { enLang['CertificateCreate.Btn.Cancel'] }
            </Button>
            <ButtonStyled
              primary
              onClick={this.onCreateHandler}
              disabled={!dataLoaded || serverStatus !== 'online'}
            >
              { enLang['CertificateCreate.Btn.Create'] }
            </ButtonStyled>
          </BtnsContainer>
        </Container>
      </CertificateCreateBodyStyled>
    );
  }
}
