import React, { PropTypes } from 'react';
import { Root, Row, Title, Col, SubTitle, Value } from './styled/info';
import enLang from '../../langs/en.json';

const CertificateInfo = (props) => {
  const {
    commonName,
    organization,
    organizationUnit,
    country,
    region,
    city,
    keyInfo,
  } = props;

  const getKeyInfoFields = () => {
    if (keyInfo.type === 'RSA') {
      return (
        <span>
          <Col>
            <SubTitle>
              { enLang['Info.InfoTable.Key.ModulusBits'] }
            </SubTitle>
            <Value>
              { keyInfo.modulusBits }
            </Value>
          </Col>
          <Col>
            <SubTitle>
              { enLang['Info.InfoTable.Key.PublicExponent'] }
            </SubTitle>
            <Value>
              { keyInfo.publicExponent }
            </Value>
          </Col>
        </span>
      );
    }
    return (
      <Col>
        <SubTitle>
          { enLang['Info.InfoTable.Key.NamedCurve'] }
        </SubTitle>
        <Value>
          { keyInfo.namedCurve }
        </Value>
      </Col>
    );
  };

  return (
    <Root>

      <Row>
        <Title>
          { enLang['Info.InfoTable.SubjectInfo'] }
        </Title>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.CommonName'] }
          </SubTitle>
          <Value>
            { commonName }
          </Value>
        </Col>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.Organization'] }
          </SubTitle>
          <Value>
            { organization }
          </Value>
        </Col>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.OrganizationUnit'] }
          </SubTitle>
          <Value>
            { organizationUnit }
          </Value>
        </Col>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.Country'] }
          </SubTitle>
          <Value>
            { country }
          </Value>
        </Col>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.Region'] }
          </SubTitle>
          <Value>
            { region }
          </Value>
        </Col>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.City'] }
          </SubTitle>
          <Value>
            { city }
          </Value>
        </Col>
      </Row>

      <Row>
        <Title>
          { enLang['Info.InfoTable.Key.Title'] }
        </Title>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.Key.Type'] }
          </SubTitle>
          <Value>
            { keyInfo.type }
          </Value>
        </Col>
        { getKeyInfoFields() }
      </Row>

    </Root>
  );
};

CertificateInfo.propTypes = {
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

export default CertificateInfo;
