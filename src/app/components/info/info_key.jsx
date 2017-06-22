import React, { PropTypes } from 'react';
// import moment from 'moment';
import { Root, Row, Title, Col, SubTitle, Value } from './styled/info';
import enLang from '../../langs/en.json';

// const lang = navigator.language;

const KeyInfo = (props) => {
  const {
    algorithm,
    usages,
    publicExponent,
    modulusLength,
    namedCurve,
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

  // const createdAtDate = moment(parseInt(createdAt, 10)).locale(lang).format('LLLL');
  // const lastUsedDate = moment(parseInt(lastUsed, 10)).locale(lang).format('LLLL');

  return (
    <Root>

      <Row>
        <Title>
          { enLang['Info.Body.PublicKeyInfo'] }
        </Title>
        {/*{*/}
          {/*renderInfoContainer(*/}
            {/*enLang['Info.Body.CreatedAt'],*/}
            {/*createdAtDate !== 'Invalid date'*/}
              {/*? createdAtDate*/}
              {/*: createdAt,*/}
          {/*)*/}
        {/*}*/}
        {/*{*/}
          {/*renderInfoContainer(*/}
            {/*enLang['Info.Body.LastUsed'],*/}
            {/*lastUsedDate !== 'Invalid date'*/}
              {/*? lastUsedDate*/}
              {/*: lastUsed,*/}
          {/*)*/}
        {/*}*/}
        { renderInfoContainer(enLang['Info.Body.Algorithm'], algorithm) }
        { renderInfoContainer(enLang['Info.Body.ModulusBits'], modulusLength) }
        { renderInfoContainer(enLang['Info.Body.PublicExponent'], publicExponent) }
        { renderInfoContainer(enLang['Info.Body.NamedCurve'], namedCurve) }
        { renderInfoContainer(enLang['Info.Body.Usages'], usages.join(', ')) }
      </Row>

    </Root>
  );
};

KeyInfo.propTypes = {
  algorithm: PropTypes.string,
  publicExponent: PropTypes.any,
  modulusLength: PropTypes.any,
  namedCurve: PropTypes.any,
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
