import React, { PropTypes } from 'react';
import { Root, Row, Title, RowCertInfo, RowCert, ColCert } from './styled/info';
import enLang from '../../langs/en.json';

const CertificateInfo = (props) => {
  const {
    subject,
    issuer,
    extensions,
    publicKey,
    version,
    signature,
    serialNumber,
    notBefore,
    notAfter,
  } = props;

  const transformCamelCase = string => (
    string
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
  );

  const renderRowContainer = (title, value, index) => {
    if (value && title !== 'name') {
      return (
        <RowCertInfo
          key={index}
        >
          <ColCert>
            { transformCamelCase(title) }:
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
          { enLang['Info.InfoTable.Certificate.General'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.InfoTable.Certificate.SerialNumber'], serialNumber) }
          { renderRowContainer(enLang['Info.InfoTable.Certificate.Version'], version) }
          { renderRowContainer(enLang['Info.InfoTable.Certificate.Issued'], notBefore) }
          { renderRowContainer(enLang['Info.InfoTable.Certificate.Expired'], notAfter) }
        </RowCert>
      </Row>

      <Row>
        <Title>
          { enLang['Info.InfoTable.Certificate.SubjectName'] }
        </Title>
        <RowCert>
          {
            Object.keys(subject).map((iss, index) => renderRowContainer(iss, subject[iss], index))
          }
        </RowCert>
      </Row>

      <Row>
        <Title>
          { enLang['Info.InfoTable.Certificate.IssuerName'] }
        </Title>
        <RowCert>
          {
            Object.keys(issuer).map((iss, index) => renderRowContainer(iss, issuer[iss], index))
          }
        </RowCert>
      </Row>

      <Row>
        <Title>
          { enLang['Info.InfoTable.Certificate.PublicKeyInfo'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.InfoTable.Key.Algorithm'], publicKey.algorithm.name) }
          { renderRowContainer(enLang['Info.InfoTable.Key.ModulusBits'], publicKey.algorithm.modulusBits) }
          { renderRowContainer(enLang['Info.InfoTable.Key.PublicExponent'], publicKey.algorithm.publicExponent) }
        </RowCert>
        <RowCert>
          { renderRowContainer(enLang['Info.InfoTable.Certificate.Value'], publicKey.value) }
        </RowCert>
      </Row>

      <Row>
        <Title>
          { enLang['Info.InfoTable.Certificate.Signature'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.InfoTable.Key.Algorithm'], signature.algorithm.name) }
          { renderRowContainer(enLang['Info.InfoTable.Certificate.Hash'], signature.algorithm.hash) }
        </RowCert>
        <RowCert>
          { renderRowContainer(enLang['Info.InfoTable.Certificate.Value'], signature.value) }
        </RowCert>
      </Row>

      <Row>
        <Title>
          { enLang['Info.InfoTable.Certificate.Extensions'] }
        </Title>
        {
          extensions.map((ext, index) => (
            <RowCert
              key={index}
            >
              { renderRowContainer(enLang['Info.InfoTable.Certificate.Name'], ext.name) }
              { renderRowContainer(enLang['Info.InfoTable.Certificate.Value'], ext.value) }
              { renderRowContainer(enLang['Info.InfoTable.Certificate.Critical'], ext.critical ? 'yes' : 'no') }
            </RowCert>
          ))
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
};

export default CertificateInfo;
