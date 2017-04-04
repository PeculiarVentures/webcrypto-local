import React, { PropTypes } from 'react';
import { Root, Row, Title, Col, SubTitle, Value } from './styled/info';
import enLang from '../../langs/en.json';

const RequestInfo = (props) => {
  const {
    commonName,
    organization,
    organizationUnit,
    country,
    region,
    city,
    keyInfo,
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

  const getKeyInfoFields = () => {
    if (keyInfo.type === 'RSA') {
      return (
        <span>
          { renderInfoContainer(enLang['Info.InfoTable.Key.ModulusBits'], keyInfo.modulusBits) }
          { renderInfoContainer(enLang['Info.InfoTable.Key.PublicExponent'], keyInfo.publicExponent) }
        </span>
      );
    }
    return (
      renderInfoContainer(enLang['Info.InfoTable.Key.NamedCurve'], keyInfo.namedCurve)
    );
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
        { renderInfoContainer(enLang['Info.InfoTable.Key.Type'], keyInfo.type) }
        { getKeyInfoFields() }
      </Row>

    </Root>
  );
};

RequestInfo.propTypes = {
  keyInfo: PropTypes.shape({
    modulusBits: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    namedCurve: PropTypes.string,
    type: PropTypes.string,
    publicExponent: PropTypes.string,
  }),
  commonName: PropTypes.string,
  organization: PropTypes.string,
  organizationUnit: PropTypes.string,
  country: PropTypes.string,
  region: PropTypes.string,
  city: PropTypes.string,
};

RequestInfo.defaultProps = {
  keyInfo: {
    modulusBits: '',
    namedCurve: '',
    type: '',
    publicExponent: '',
  },
  commonName: '',
  organization: '',
  organizationUnit: '',
  country: '',
  region: '',
  city: '',
};

export default RequestInfo;
