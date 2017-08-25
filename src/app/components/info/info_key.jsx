import React, { PropTypes } from 'react';
import { Root, Row, Title, RowCertInfo, ColCert, RowCert } from './styled/info';
import enLang from '../../langs/en.json';

const KeyInfo = (props) => {
  const {
    algorithm,
    usages,
    publicExponent,
    modulusLength,
    namedCurve,
  } = props;

  const renderRowContainer = (title, value, index, monospace) => {
    if (value && title !== 'name') {
      return (
        <RowCertInfo
          key={index}
        >
          <ColCert>
            { title }{title === 'None' ? '' : ':'}
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
          { enLang['Info.Body.PublicKeyInfo'] }
        </Title>
        <RowCert>
          { renderRowContainer(enLang['Info.Body.Algorithm'], algorithm) }
          { renderRowContainer(enLang['Info.Body.ModulusBits'], modulusLength) }
          { renderRowContainer(enLang['Info.Body.PublicExponent'], publicExponent) }
          { renderRowContainer(enLang['Info.Body.NamedCurve'], namedCurve) }
          { renderRowContainer(enLang['Info.Body.Usages'], usages.join(', ')) }
        </RowCert>
      </Row>

    </Root>
  );
};

KeyInfo.propTypes = {
  algorithm: PropTypes.string,
  publicExponent: PropTypes.oneOfType([PropTypes.any]),
  modulusLength: PropTypes.oneOfType([PropTypes.any]),
  namedCurve: PropTypes.oneOfType([PropTypes.any]),
  usages: PropTypes.arrayOf(PropTypes.string),
};

KeyInfo.defaultProps = {
  algorithm: '',
  usages: [],
  publicExponent: '',
  modulusLength: '',
  namedCurve: '',
};

export default KeyInfo;
