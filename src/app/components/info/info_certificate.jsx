import React, { PropTypes } from 'react';
import { Root, Row, Title, RowCertInfo, RowCert, ColCert } from './styled/info';
import enLang from '../../langs/en.json';

const CertificateInfo = (props) => {
  const {
    general,
    subject,
    issuer,
    publicKey,
    signature,
    extensions,
  } = props;

  // const transformCamelCase = string => (
  //   string
  //     .replace(/([A-Z])/g, ' $1')
  //     .replace(/^./, str => str.toUpperCase())
  // );

  const renderRowContainer = (title, value, index) => {
    if (value && title !== 'name') {
      return (
        <RowCertInfo
          key={index}
        >
          <ColCert>
            { title }{title === 'None' ? '' : ':'}
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
          { enLang['Info.Body.General'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.Body.SerialNumber'], general.serialNumber) }
          { renderRowContainer(enLang['Info.Body.Version'], general.version) }
          { renderRowContainer(enLang['Info.Body.Issued'], general.notBefore) }
          { renderRowContainer(enLang['Info.Body.Expired'], general.notAfter) }
          <RowCert>
            { renderRowContainer(enLang['Info.Body.Thumbprint'], general.thumbprint) }
          </RowCert>
        </RowCert>
      </Row>

      <Row>
        <Title>
          { enLang['Info.Body.SubjectName'] }
        </Title>
        <RowCert>
          {
            Object.keys(subject).map((iss, index) => renderRowContainer(iss, subject[iss], index))
          }
        </RowCert>
      </Row>

      <Row>
        <Title>
          { enLang['Info.Body.IssuerName'] }
        </Title>
        <RowCert>
          {
            Object.keys(issuer).map((iss, index) => renderRowContainer(iss, issuer[iss], index))
          }
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
          { renderRowContainer(enLang['Info.Body.Value'], publicKey.value) }
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

      <Row>
        <Title>
          { enLang['Info.Body.Extensions'] }
        </Title>
        {
          extensions.length
          ? extensions.map((ext, index) => (
            <RowCert
              key={index}
            >
              { renderRowContainer(enLang['Info.Body.Name'], ext.name) }
              { renderRowContainer(enLang['Info.Body.Value'], ext.value) }
              { renderRowContainer(enLang['Info.Body.Critical'], ext.critical ? 'yes' : 'no') }
            </RowCert>
          ))
          : <RowCert>
            { renderRowContainer(enLang['Info.Body.None'], ' ') }
          </RowCert>
        }
      </Row>
    </Root>
  );
};

CertificateInfo.propTypes = {
  general: PropTypes.shape({
    serialNumber: PropTypes.string,
    version: PropTypes.number,
    notBefore: PropTypes.string,
    notAfter: PropTypes.string,
    thumbprint: PropTypes.string,
  }),
  subject: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  issuer: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  publicKey: PropTypes.shape({
    modulusBits: PropTypes.any,
    namedCurve: PropTypes.any,
    publicExponent: PropTypes.any,
    algorithm: PropTypes.string,
    value: PropTypes.string,
  }),
  signature: PropTypes.shape({
    algorithm: PropTypes.string,
    hash: PropTypes.string,
    value: PropTypes.string,
  }),
  extensions: PropTypes.oneOfType([
    PropTypes.array,
  ]),
};

CertificateInfo.defaultProps = {
  general: {
    serialNumber: '',
    version: '',
    notBefore: '',
    notAfter: '',
    thumbprint: '',
  },
  subject: {},
  issuer: {},
  publicKey: {
    modulusBits: '',
    namedCurve: '',
    publicExponent: '',
    algorithm: '',
    value: '',
  },
  signature: {
    algorithm: '',
    hash: '',
    value: '',
  },
  extensions: [],
};

export default CertificateInfo;
