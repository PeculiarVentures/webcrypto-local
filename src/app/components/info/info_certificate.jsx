import React, { PropTypes } from 'react';
import moment from 'moment';
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

  const createdAtDate = moment(parseInt(keyInfo.createdAt, 10)).format('D MMM YYYY');
  const lastUsedDate = moment(parseInt(keyInfo.lastUsed, 10)).format('D MMM YYYY');

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
          { enLang['Info.InfoTable.KeyInfo'] }
        </Title>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.CreatedAt'] }
          </SubTitle>
          <Value>
            {
              createdAtDate !== 'Invalid date'
                ? createdAtDate
                : keyInfo.createdAt
            }
          </Value>
        </Col>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.LastUsed'] }
          </SubTitle>
          <Value>
            {
              lastUsedDate !== 'Invalid date'
                ? lastUsedDate
                : keyInfo.lastUsed
            }
          </Value>
        </Col>
      </Row>

    </Root>
  );
};

CertificateInfo.propTypes = {
  keyInfo: PropTypes.shape({
    createdAt: PropTypes.string,
    lastUsed: PropTypes.string,
    algorithm: PropTypes.string,
    size: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    usages: PropTypes.arrayOf(PropTypes.string),
  }),
  commonName: PropTypes.string,
  organization: PropTypes.string,
  organizationUnit: PropTypes.string,
  country: PropTypes.string,
  region: PropTypes.string,
  city: PropTypes.string,
};

export default CertificateInfo;
