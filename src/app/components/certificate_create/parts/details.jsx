import React, { Component } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker.js';
import { TextField } from '../../basic';
import { Title, GroupContainer, GroupPart } from './styles';
import enLang from '../../../langs/en.json';
import { getCurrentDate } from '../../../helpers';

const TextFieldContainer = styled.div`
  display: inline-block;
  width: calc(33.3% - 16px);
  vertical-align: top;
  margin-left: 24px;
  &:first-child {
    margin-left: 0;
  }
  @media ${props => props.theme.media.mobile} {
    margin-left: 12px;
    margin-top: 15px;
    width: calc(50% - 6px);
    &:nth-child(1),
    &:nth-child(2) {
      margin-top: 0;
    }
    &:nth-child(2n-1) {
      margin-left: 0;
    }
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

    Object.keys(fieldNodes).map((field) => (
      fieldNodes[field].validate()
    ));
  }

  componentDidMount() {
    const { fieldNodes } = this;
    const { startDate, expirationDate } = fieldNodes;
    $(startDate.fieldNode).datepicker({
      navigationAsDateFormat: true,
      showOtherMonths: true,
      dateFormat: 'yy-mm-dd',
      selectOtherMonths: true,
      defaultDate: getCurrentDate(),
    });
    $(expirationDate.fieldNode).datepicker({
      navigationAsDateFormat: true,
      showOtherMonths: true,
      dateFormat: 'yy-mm-dd',
      selectOtherMonths: true,
    });
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
              ref={node => (this.fieldNodes.name = node)}
              validation={['text']}
              errorText={enLang['CertificateCreate.Details.Field.FriendlyName.Error']}
            />
          </TextFieldContainer>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Details.Field.StartDate']}
              name="startDate"
              value={getCurrentDate()}
              ref={node => (this.fieldNodes.startDate = node)}
              validation={['date']}
              errorText={enLang['CertificateCreate.Details.Field.StartDate.Error']}
            />
          </TextFieldContainer>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Details.Field.ExpirationDate']}
              name="expirationDate"
              ref={node => (this.fieldNodes.expirationDate = node)}
              validation={['date']}
              errorText={enLang['CertificateCreate.Details.Field.ExpirationDate.Error']}
            />
          </TextFieldContainer>
        </GroupPart>
      </GroupContainer>
    );
  }
}
