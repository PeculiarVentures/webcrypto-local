import React, { PropTypes } from 'react';
import moment from 'moment';
import { Root, Row, Title, Col, SubTitle, Value } from './styled/info';
import enLang from '../../langs/en.json';

const lang = navigator.language;

const KeyInfo = (props) => {
  const {
    createdAt,
    lastUsed,
    algorithm,
    size,
    usages,
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

  const createdAtDate = moment(parseInt(createdAt, 10)).locale(lang).format('LLLL');
  const lastUsedDate = moment(parseInt(lastUsed, 10)).locale(lang).format('LLLL');

  return (
    <Root>

      <Row>
        <Title>
          { enLang['Info.InfoTable.Key.Title'] }
        </Title>
        {
          renderInfoContainer(
            enLang['Info.InfoTable.Key.CreatedAt'],
            createdAtDate !== 'Invalid date'
              ? createdAtDate
              : createdAt,
          )
        }
        {
          renderInfoContainer(
            enLang['Info.InfoTable.Key.LastUsed'],
            lastUsedDate !== 'Invalid date'
              ? lastUsedDate
              : lastUsed,
          )
        }
        { renderInfoContainer(enLang['Info.InfoTable.Key.Algorithm'], algorithm) }
        { renderInfoContainer(enLang['Info.InfoTable.Key.Size'], size) }
        { renderInfoContainer(enLang['Info.InfoTable.Key.Usages'], usages.join(', ')) }
      </Row>

    </Root>
  );
};

KeyInfo.propTypes = {
  createdAt: PropTypes.string,
  lastUsed: PropTypes.string,
  algorithm: PropTypes.string,
  size: PropTypes.string,
  usages: PropTypes.arrayOf(PropTypes.string),
};

KeyInfo.defaultProps = {
  createdAt: '',
  lastUsed: '',
  algorithm: '',
  size: '',
  usages: [],
};

export default KeyInfo;
