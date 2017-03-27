import React, { PropTypes } from 'react';
import moment from 'moment';
import { Root, Row, Title, Col, SubTitle, Value } from './styled/info';
import enLang from '../../langs/en.json';

const CertificateInfo = (props) => {
  const {
    name,
    startDate,
    expirationDate,
    hostName,
    organization,
    organizationUnit,
    country,
    region,
    city,
    keyInfo,
  } = props;

  return (
    <Root>

      <Row>
        <Title>
          { enLang['Info.InfoTable.Details'] }
        </Title>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.FriendlyName'] }
          </SubTitle>
          <Value>
            { name }
          </Value>
        </Col>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.StartDate'] }
          </SubTitle>
          <Value>
            {
              startDate
                ? moment(parseInt(startDate)).format('D MMM YYYY')
                : null
            }
          </Value>
        </Col>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.ExpirationDate'] }
          </SubTitle>
          <Value>
            {
              expirationDate
                ? moment(parseInt(expirationDate)).format('D MMM YYYY')
                : null
            }
          </Value>
        </Col>
      </Row>

      <Row>
        <Title>
          { enLang['Info.InfoTable.SubjectInfo'] }
        </Title>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.HostName'] }
          </SubTitle>
          <Value>
            { hostName }
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
              keyInfo.createdAt
                ? moment(parseInt(keyInfo.createdAt)).format('D MMM YYYY')
                : null
            }
          </Value>
        </Col>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.LastUsed'] }
          </SubTitle>
          <Value>
            {
              keyInfo.lastUsed
                ? moment(parseInt(keyInfo.lastUsed)).format('D MMM YYYY')
                : null
            }
          </Value>
        </Col>
      </Row>

    </Root>
  );
};

CertificateInfo.propTypes = {
  name: PropTypes.string,
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
  hostName: PropTypes.string,
  organization: PropTypes.string,
  organizationUnit: PropTypes.string,
  country: PropTypes.string,
  region: PropTypes.string,
  city: PropTypes.string,
  startDate: PropTypes.string,
  expirationDate: PropTypes.string,
};

export default CertificateInfo;
