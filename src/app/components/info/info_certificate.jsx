import React, { PropTypes } from 'react';
import { Root, Row, Title, RowCertInfo, RowCert, ColCert } from './styled/info';
import enLang from '../../langs/en.json';

const CertificateInfo = (props) => {
  const {
    commonName,
    organization,
    organizationUnit,
    country,
    region,
    city,
    extensions,
    publicKey,
    version,
    signature,
    serialNumber,
  } = props;

  const renderRowContainer = (title, value) => {
    if (value) {
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
          { enLang['Info.InfoTable.Certificate.IssuerName'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.InfoTable.OrganizationUnit'], organizationUnit) }
          { renderRowContainer(enLang['Info.InfoTable.Organization'], organization) }
          { renderRowContainer(enLang['Info.InfoTable.CommonName'], commonName) }
          { renderRowContainer(enLang['Info.InfoTable.Country'], country) }
          { renderRowContainer(enLang['Info.InfoTable.Region'], region) }
          { renderRowContainer(enLang['Info.InfoTable.City'], city) }
        </RowCert>
        <RowCert>
          { renderRowContainer(enLang['Info.InfoTable.Certificate.SerialNumber'], serialNumber) }
          { renderRowContainer(enLang['Info.InfoTable.Certificate.Version'], version) }
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
          { enLang['Info.InfoTable.Certificate.Extension'] }
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

  // return (
  //   <Root>
  //
  //     <Row>
  //       <Title>
  //         { enLang['Info.InfoTable.SubjectInfo'] }
  //       </Title>
  //       { renderInfoContainer(enLang['Info.InfoTable.CommonName'], commonName) }
  //       { renderInfoContainer(enLang['Info.InfoTable.Organization'], organization) }
  //       { renderInfoContainer(enLang['Info.InfoTable.OrganizationUnit'], organizationUnit) }
  //       { renderInfoContainer(enLang['Info.InfoTable.Country'], country) }
  //       { renderInfoContainer(enLang['Info.InfoTable.Region'], region) }
  //       { renderInfoContainer(enLang['Info.InfoTable.City'], city) }
  //     </Row>
  //
  //     <Row>
  //       <Title>
  //         { enLang['Info.InfoTable.Key.Title'] }
  //       </Title>
  //       { renderInfoContainer(enLang['Info.InfoTable.Key.Type'], keyInfo.type) }
  //       { getKeyInfoFields() }
  //     </Row>
  //
  //   </Root>
  // );
};

CertificateInfo.propTypes = {
  commonName: PropTypes.string,
  organization: PropTypes.string,
  organizationUnit: PropTypes.string,
  country: PropTypes.string,
  region: PropTypes.string,
  city: PropTypes.string,
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
  serialNumber: PropTypes.string,
};

CertificateInfo.defaultProps = {
  commonName: '',
  organization: '',
  organizationUnit: '',
  country: '',
  region: '',
  city: '',
  extensions: [],
  publicKey: {},
  version: '',
  signature: {},
  serialNumber: '',
};

export default CertificateInfo;
