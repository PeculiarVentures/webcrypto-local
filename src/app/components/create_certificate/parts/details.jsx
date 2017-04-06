import React, { Component } from 'react';
import styled from 'styled-components';
import { TextField } from '../../basic';
import { Title, GroupContainer, GroupPart } from './styles';
import enLang from '../../../langs/en.json';

const TextFieldContainer = styled.div`
  display: inline-block;
  width: calc(33.3% - 16px);
  vertical-align: top;
  margin-left: 24px;
  &:first-child {
    margin-left: 0;
  }
  @media ${props => props.theme.media.mobile} {
    margin-left: 0;
    margin-top: 20px;
    width: 100%;
  }
`;

export default class Details extends Component {

  static modifyDate(date) {
    return new Date(date).getTime().toString();
  }

  constructor() {
    super();
    this.fieldNodes = {};
  }

  getData = () => {
    const { fieldNodes } = this;
    const data = {};

    Object.keys(fieldNodes).map((field) => {
      const node = fieldNodes[field];
      if (field.indexOf('Date') !== -1) {
        data[field] = Details.modifyDate(node.getValue());
      } else {
        data[field] = node.getValue();
      }
    });

    return data;
  };

  isValidFields = () => {
    this.validateFields();
    const { fieldNodes } = this;
    let valid = true;

    Object.keys(fieldNodes).map((field) => {
      const node = fieldNodes[field];
      if (!node.isValid()) {
        valid = false;
      }
    });

    return valid;
  };

  validateFields() {
    const { fieldNodes } = this;

    Object.keys(fieldNodes).map(field => (
      fieldNodes[field].validate()
    ));
  }

  render() {
    return (
      <GroupContainer>
        <Title>
          { enLang['CertificateCreate.Details.Title'] }
        </Title>
        <GroupPart>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Details.Field.FriendlyName']}
              name="friendlyName"
              ref={node => (this.fieldNodes.commonName = node)}
              validation={['text']}
              errorText={enLang['CertificateCreate.Details.Field.FriendlyName.Error']}
            />
          </TextFieldContainer>
        </GroupPart>
      </GroupContainer>
    );
  }
}
