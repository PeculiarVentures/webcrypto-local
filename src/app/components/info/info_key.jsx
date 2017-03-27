import React, { PropTypes } from 'react';
import moment from 'moment';
import { Root, Row, Title, Col, SubTitle, Value } from './styled/info';
import enLang from '../../langs/en.json';

const KeyInfo = (props) => {
  const {
    createdAt,
    lastUsed,
    algorithm,
    size,
    usages,
  } = props;

  const renderUsages = () => usages.map((usage, key) => {
    if (key === usages.length - 1) {
      return usage;
    }
    return `${usage}, `;
  });

  return (
    <Root>

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
              createdAt
                ? moment(parseInt(createdAt)).format('D MMM YYYY')
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
              lastUsed
                ? moment(parseInt(lastUsed)).format('D MMM YYYY')
                : null
            }
          </Value>
        </Col>
        <br />
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.Algorithm'] }
          </SubTitle>
          <Value>
            { algorithm }
          </Value>
        </Col>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.Size'] }
          </SubTitle>
          <Value>
            { size }
          </Value>
        </Col>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.Usages'] }
          </SubTitle>
          <Value>
            { renderUsages() }
          </Value>
        </Col>
      </Row>

    </Root>
  );
};

KeyInfo.propTypes = {
  createdAt: PropTypes.string,
  lastUsed: PropTypes.string,
  algorithm: PropTypes.string,
  size: PropTypes.number,
  usages: PropTypes.arrayOf(PropTypes.string),
};

export default KeyInfo;
