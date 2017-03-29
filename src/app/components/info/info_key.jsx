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

  const createdAtDate = moment(parseInt(createdAt, 10)).format('D MMM YYYY');
  const lastUsedDate = moment(parseInt(lastUsed, 10)).format('D MMM YYYY');

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
              createdAtDate !== 'Invalid date'
                ? createdAtDate
                : createdAt
            }
          </Value>
        </Col>
        <Col>
          <SubTitle>
            { enLang['Info.InfoTable.LastUsed'] }
          </SubTitle>
          <Value>
            {
              lastUsedDate !== 'Invalid date'
                ? lastUsedDate
                : lastUsed
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
