import React, { PropTypes } from 'react';
import { Root, Row, Title, RowCertInfo, ColCert, RowCert } from './styled/info';
import enLang from '../../langs/en.json';

const RequestInfo = (props) => {
  const {
    subject,
    publicKey,
    signature,
  } = props;

  const renderRowContainer = (title, value, monospace) => {
    if (value && title !== 'name') {
      return (
        <RowCertInfo>
          <ColCert>
            { title }:
          </ColCert>
          <ColCert monospace={monospace}>
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
        <RowCert>
          { renderRowContainer(enLang['Info.Body.CommonName'], subject['Common Name']) }
          { renderRowContainer(enLang['Info.Body.Organization'], subject.Organization) }
          { renderRowContainer(enLang['Info.Body.OrganizationUnit'], subject['Organization Unit']) }
          { renderRowContainer(enLang['Info.Body.Country'], subject.Country) }
          { renderRowContainer(enLang['Info.Body.Region'], subject.Region) }
          { renderRowContainer(enLang['Info.Body.City'], subject.City) }
        </RowCert>
      </Row>

      <Row>
        <Title>
          { enLang['Info.Body.PublicKeyInfo'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.Body.Algorithm'], publicKey.algorithm) }
          { renderRowContainer(enLang['Info.Body.ModulusBits'], publicKey.modulusBits) }
          { renderRowContainer(enLang['Info.Body.PublicExponent'], publicKey.publicExponent) }
          { renderRowContainer(enLang['Info.Body.NamedCurve'], publicKey.namedCurve) }
        </RowCert>
        <RowCert>
          { renderRowContainer(enLang['Info.Body.Value'], publicKey.value, true) }
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
          { renderRowContainer(enLang['Info.Body.Value'], signature.value, true) }
        </RowCert>
      </Row>

    </Root>
  );
};

RequestInfo.propTypes = {
  subject: PropTypes.shape({
    'Common Name': PropTypes.string,
    City: PropTypes.string,
    Country: PropTypes.string,
    Organization: PropTypes.string,
    'Organization Unit': PropTypes.string,
    Region: PropTypes.string,
  }),
  publicKey: PropTypes.shape({
    algorithm: PropTypes.string,
    hash: PropTypes.string,
    modulusBits: PropTypes.any,
    namedCurve: PropTypes.any,
    publicExponent: PropTypes.any,
    value: PropTypes.string,
  }),
  signature: PropTypes.shape({
    algorithm: PropTypes.string,
    hash: PropTypes.string,
    value: PropTypes.string,
  }),
};

RequestInfo.defaultProps = {
  subject: {
    'Common Name': '',
    City: '',
    Country: '',
    Organization: '',
    'Organization Unit': '',
    Region: '',
  },
  publicKey: {
    algorithm: '',
    hash: '',
    modulusBits: '',
    namedCurve: '',
    publicExponent: '',
    value: '',
  },
  signature: {
    algorithm: '',
    hash: '',
    value: '',
  },
};

export default RequestInfo;
