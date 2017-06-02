import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { SelectField, SelectItem, SelectNative } from '../../basic';
import { Title, GroupContainer, GroupPart } from './styles';
import enLang from '../../../langs/en.json';

const TextFieldContainer = styled.div`
  display: inline-block;
  width: calc(33.3% - 16px);
  vertical-align: top;
  margin-left: 24px;
  margin-top: 28px;
  &:nth-child(3n-2) {
    margin-left: 0;
  }
  &:nth-child(1),
  &:nth-child(2),
  &:nth-child(3) {
    margin-top: 0;
  }
  @media ${props => props.theme.media.mobile} {
    margin-left: 0;
    width: 100%;
    margin-top: 15px !important;
  }
`;

export default class SelfSigned extends Component {

  static contextTypes = {
    deviceType: PropTypes.string,
    dispatch: PropTypes.func,
  };

  constructor() {
    super();

    this.values = [
      {
        id: '1',
        name: 'no',
      }, {
        id: '2',
        name: 'yes',
      },
    ];
    this.fieldNodes = {};
  }

  shouldComponentUpdate() {
    return false;
  }

  getData = () => {
    const { fieldNodes } = this;
    const data = {};

    // fields
    Object.keys(fieldNodes).map((field) => {
      const node = fieldNodes[field];
      if (node) {
        if ({}.hasOwnProperty.call(node, 'getData')) {
          data[field] = node.getData().value;
        } else {
          data[field] = node.getValue();
        }
      }
      return true;
    });

    return data;
  };

  render() {
    const { deviceType } = this.context;

    return (
      <GroupContainer>
        <Title>
          { enLang['CertificateCreate.CMS.Title'] }
        </Title>
        <GroupPart>
          <TextFieldContainer>
            {
              deviceType === 'phone'
              ? <SelectNative
                options={this.values.map(item => ({
                  value: item.name,
                  name: item.name,
                }))}
                onChange={this.onSelectHandler}
                defaultSelected={this.values[0].name}
                ref={node => (this.fieldNodes.selfSigned = node)}
              />
              : <SelectField
                onChange={this.onSelectHandler}
                ref={node => (this.fieldNodes.selfSigned = node)}
                defaultSelected={{
                  name: this.values[0].name,
                  value: this.values[0].name,
                  index: 0,
                }}
              >
                {
                  this.values.map((item, index) => (
                    <SelectItem
                      key={index}
                      value={item.name}
                      primaryText={item.name}
                    />
                  ))
                }
              </SelectField>
            }
          </TextFieldContainer>
        </GroupPart>
      </GroupContainer>
    );
  }
}
