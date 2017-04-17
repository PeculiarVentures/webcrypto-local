import React, { PropTypes } from 'react';
import { Root, Row, Title, Col, SubTitle, Value, RowCertInfo, ColCert, RowCert } from './styled/info';
import enLang from '../../langs/en.json';

const RequestInfo = (props) => {
  const {
    commonName,
    organization,
    organizationUnit,
    country,
    region,
    city,
    publicKeyInfo,
    signature,
  } = props;

  const renderInfoContainer = (title, value) => {
    if (value) {
      return (
        <Col>
          <SubTitle>
            { title }
          </SubTitle>
          <Value>
            { value }
          </Value>
        </Col>
      );
    }
    return null;
  };

  const renderRowContainer = (title, value) => {
    if (value && title !== 'name') {
      return (
        <RowCertInfo>
          <ColCert>
            { title }:
          </ColCert>
          <ColCert>
            { value }
          </ColCert>
        </RowCertInfo>
      );
    }
    return null;
  };

  return (
    <Root>

      <Row>
        <Title>
          { enLang['Info.Body.SubjectInfo'] }
        </Title>
        { renderInfoContainer(enLang['Info.Body.CommonName'], commonName) }
        { renderInfoContainer(enLang['Info.Body.Organization'], organization) }
        { renderInfoContainer(enLang['Info.Body.OrganizationUnit'], organizationUnit) }
        { renderInfoContainer(enLang['Info.Body.Country'], country) }
        { renderInfoContainer(enLang['Info.Body.Region'], region) }
        { renderInfoContainer(enLang['Info.Body.City'], city) }
      </Row>

      <Row>
        <Title>
          { enLang['Info.Body.PublicKeyInfo'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.Body.Algorithm'], publicKeyInfo.type) }
          { renderRowContainer(enLang['Info.Body.ModulusBits'], publicKeyInfo.modulusBits) }
          { renderRowContainer(enLang['Info.Body.PublicExponent'], publicKeyInfo.publicExponent) }
          { renderRowContainer(enLang['Info.Body.NamedCurve'], publicKeyInfo.namedCurve) }
        </RowCert>
        <RowCert>
          { renderRowContainer(enLang['Info.Body.Value'], publicKeyInfo.value) }
        </RowCert>
      </Row>

      <Row>
        <Title>
          { enLang['Info.Body.Signature'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.Body.Algorithm'], signature.algorithm) }
          { renderRowContainer(enLang['Info.Body.Hash'], signature.hash) }
        </RowCert>
        <RowCert>
          { renderRowContainer(enLang['Info.Body.Value'], signature.value) }
        </RowCert>
      </Row>

    </Root>
  );
};

RequestInfo.propTypes = {
  publicKeyInfo: PropTypes.shape({
    modulusBits: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    namedCurve: PropTypes.string,
    type: PropTypes.string,
    publicExponent: PropTypes.string,
    value: PropTypes.string,
  }),
  signature: PropTypes.shape({
    algorithm: PropTypes.string,
    hash: PropTypes.string,
  }),
  commonName: PropTypes.string,
  organization: PropTypes.string,
  organizationUnit: PropTypes.string,
  country: PropTypes.string,
  region: PropTypes.string,
  city: PropTypes.string,
};

RequestInfo.defaultProps = {
  publicKeyInfo: {
    modulusBits: '',
    namedCurve: '',
    type: '',
    publicExponent: '',
    value: '',
  },
  signature: {
    algorithm: '',
    hash: '',
  },
  commonName: '',
  organization: '',
  organizationUnit: '',
  country: '',
  region: '',
  city: '',
};

export default RequestInfo;
