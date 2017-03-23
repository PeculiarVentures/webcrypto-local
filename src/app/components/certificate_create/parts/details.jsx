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

  getData = () => {
    return {
      name: this.friendlyNameNode.getValue(),
      startDate: Details.modifyDate(this.startDateNode.getValue()),
      expirationDate: Details.modifyDate(this.expirationDateNode.getValue()),
    };
  };

  componentDidMount() {
    $(this.startDateNode.fieldNode).datepicker({
      navigationAsDateFormat: true,
      showOtherMonths: true,
      dateFormat: 'yy-mm-dd',
      selectOtherMonths: true,
      defaultDate: getCurrentDate(),
    });
    $(this.expirationDateNode.fieldNode).datepicker({
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
          { enLang['CertificateCreate.Body.Details.Title'] }
        </Title>
        <GroupPart>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Body.Details.Field.FriendlyName']}
              name="friendlyName"
              ref={node => (this.friendlyNameNode = node)}
            />
          </TextFieldContainer>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Body.Details.Field.StartDate']}
              name="startDate"
              value={getCurrentDate()}
              ref={node => (this.startDateNode = node)}
            />
          </TextFieldContainer>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Body.Details.Field.ExpirationDate']}
              name="expirationDate"
              ref={node => (this.expirationDateNode = node)}
            />
          </TextFieldContainer>
        </GroupPart>
      </GroupContainer>
    );
  }
}
