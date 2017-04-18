import React, { PropTypes } from 'react';
import { Root, Row, Title, RowCertInfo, RowCert, ColCert } from './styled/info';
import enLang from '../../langs/en.json';

const CertificateInfo = (props) => {
  const {
    subject,
    issuer,
    publicKey,
    extensions,
    version,
    signature,
    serialNumber,
    notBefore,
    notAfter,
    thumbprint,
  } = props;

  const transformCamelCase = string => (
    string
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
  );

  const renderRowContainer = (title, value, index, transform, monospace) => {
    if (value && title !== 'name') {
      return (
        <RowCertInfo
          key={index}
        >
          <ColCert>
            { transform === false ? title : transformCamelCase(title) }{title === 'None' ? '' : ':'}
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
          { enLang['Info.Body.General'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.Body.SerialNumber'], serialNumber, '', '', true) }
          { renderRowContainer(enLang['Info.Body.Version'], version) }
          { renderRowContainer(enLang['Info.Body.Issued'], notBefore) }
          { renderRowContainer(enLang['Info.Body.Expired'], notAfter) }
          <RowCert>
            { renderRowContainer(enLang['Info.Body.Thumbprint'], thumbprint, '', false, true) }
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
          { renderRowContainer(enLang['Info.Body.Algorithm'], publicKey.algorithm.name) }
          { renderRowContainer(enLang['Info.Body.ModulusBits'], publicKey.algorithm.modulusBits) }
          { renderRowContainer(enLang['Info.Body.PublicExponent'], publicKey.algorithm.publicExponent) }
        </RowCert>
        <RowCert>
          { renderRowContainer(enLang['Info.Body.Value'], publicKey.value, '', '', true) }
        </RowCert>
      </Row>

      <Row>
        <Title>
          { enLang['Info.Body.Signature'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.Body.Algorithm'], signature.algorithm.name) }
          { renderRowContainer(enLang['Info.Body.Hash'], signature.algorithm.hash) }
        </RowCert>
        <RowCert>
          { renderRowContainer(enLang['Info.Body.Value'], signature.value, '', '', true) }
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
              { renderRowContainer(enLang['Info.Body.Value'], ext.value, '', '', true) }
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
  extensions: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  publicKey: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  version: PropTypes.number,
  signature: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  issuer: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  subject: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  serialNumber: PropTypes.string,
  notAfter: PropTypes.string,
  notBefore: PropTypes.string,
  thumbprint: PropTypes.string,
};

CertificateInfo.defaultProps = {
  extensions: [],
  publicKey: {},
  version: '',
  signature: {},
  serialNumber: '',
  issuer: {},
  subject: {},
  notAfter: '',
  notBefore: '',
  thumbprint: '',
};

export default CertificateInfo;
