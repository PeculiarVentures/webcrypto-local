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
          { enLang['Info.InfoTable.SubjectInfo'] }
        </Title>
        { renderInfoContainer(enLang['Info.InfoTable.CommonName'], commonName) }
        { renderInfoContainer(enLang['Info.InfoTable.Organization'], organization) }
        { renderInfoContainer(enLang['Info.InfoTable.OrganizationUnit'], organizationUnit) }
        { renderInfoContainer(enLang['Info.InfoTable.Country'], country) }
        { renderInfoContainer(enLang['Info.InfoTable.Region'], region) }
        { renderInfoContainer(enLang['Info.InfoTable.City'], city) }
      </Row>

      <Row>
        <Title>
          { enLang['Info.InfoTable.Key.Title'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.InfoTable.Key.Algorithm'], publicKeyInfo.type) }
          { renderRowContainer(enLang['Info.InfoTable.Key.ModulusBits'], publicKeyInfo.modulusBits) }
          { renderRowContainer(enLang['Info.InfoTable.Key.PublicExponent'], publicKeyInfo.publicExponent) }
          { renderRowContainer(enLang['Info.InfoTable.Key.NamedCurve'], publicKeyInfo.namedCurve) }
        </RowCert>
        <RowCert>
          { renderRowContainer(enLang['Info.InfoTable.Key.Value'], publicKeyInfo.value) }
        </RowCert>
      </Row>

      <Row>
        <Title>
          { enLang['Info.InfoTable.Certificate.Signature'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.InfoTable.Key.Algorithm'], signature.algorithm) }
          { renderRowContainer(enLang['Info.InfoTable.Certificate.Hash'], signature.hash) }
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
