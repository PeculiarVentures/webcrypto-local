import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { TextField, SelectField, SelectItem, SelectNative } from '../../basic';
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

export default class SubjectInfo extends Component {

  static propTypes = {
    countries: PropTypes.oneOfType([
      PropTypes.array,
    ]),
  };

  static contextTypes = {
    deviceType: PropTypes.string,
  };

  constructor() {
    super();
    this.fieldNodes = {};
  }

  getData = () => {
    const { fieldNodes } = this;
    const data = {};

    Object.keys(fieldNodes).map((field) => {
      const node = fieldNodes[field];
      if ({}.hasOwnProperty.call(node, 'getData')) {
        data[field] = node.getData().value;
      } else {
        data[field] = node.getValue();
      }
      return true;
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
      return true;
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
    const { countries } = this.props;
    const { deviceType } = this.context;

    return (
      <GroupContainer>
        <Title>
          { enLang['CertificateCreate.Subject.Title'] }
        </Title>
        <GroupPart>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Subject.Field.CommonName']}
              name="hostName"
              ref={node => (this.fieldNodes.commonName = node)}
              validation={['text']}
              errorText={enLang['CertificateCreate.Subject.Field.CommonName.Error']}
            />
          </TextFieldContainer>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Subject.Field.Organization']}
              name="organization"
              ref={node => (this.fieldNodes.organization = node)}
            />
          </TextFieldContainer>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Subject.Field.OrganizationUnit']}
              name="organizationUnit"
              ref={node => (this.fieldNodes.organizationUnit = node)}
            />
          </TextFieldContainer>
          <TextFieldContainer>
            {
              deviceType === 'phone'
                ? <SelectNative
                  labelText={enLang['CertificateCreate.Subject.Field.Country']}
                  placeholder="Select country..."
                  ref={node => (this.fieldNodes.country = node)}
                  options={countries}
                />
                : <SelectField
                  labelText={enLang['CertificateCreate.Subject.Field.Country']}
                  placeholder="Select country..."
                  name="country"
                  ref={node => (this.fieldNodes.country = node)}
                >
                  {
                    countries.map((item, index) => (
                      <SelectItem
                        key={index}
                        value={item.code}
                        primaryText={item.value}
                      />
                    ))
                  }
                </SelectField>
            }
          </TextFieldContainer>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Subject.Field.Region']}
              name="region"
              ref={node => (this.fieldNodes.state = node)}
            />
          </TextFieldContainer>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Subject.Field.City']}
              name="city"
              ref={node => (this.fieldNodes.locality = node)}
            />
          </TextFieldContainer>
        </GroupPart>
      </GroupContainer>
    );
  }
}
