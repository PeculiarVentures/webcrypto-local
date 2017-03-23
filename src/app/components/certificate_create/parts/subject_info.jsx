import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { TextField, SelectField, SelectItem } from '../../basic';
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
    margin-left: 12px;
    width: calc(50% - 6px);
    margin-top: 15px;
    &:nth-child(1),
    &:nth-child(2) {
      margin-top: 0;
    }
    &:nth-child(3) {
      margin-top: 15px;
    }
    &:nth-child(3n-2) {
      margin-left: 12px;
    }
    &:nth-child(2n-1) {
      margin-left: 0;
    }
  }
`;

export default class SubjectInfo extends Component {

  static propTypes = {
    countries: PropTypes.oneOfType([
      PropTypes.array,
    ]),
  };

  getData = () => {
    return {
      hostName: this.hostNameNode.getValue(),
      organization: this.OrganizationNode.getValue(),
      organizationUnit: this.organizationUnitNode.getValue(),
      country: this.countryNode.getData().value,
      region: this.regionNode.getValue(),
      city: this.cityNode.getValue(),
    };
  };

  render() {
    const { countries } = this.props;

    return (
      <GroupContainer>
        <Title>
          { enLang['CertificateCreate.Body.Subject.Title'] }
        </Title>
        <GroupPart>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Body.Subject.Field.HostName']}
              name="hostName"
              ref={node => (this.hostNameNode = node)}
            />
          </TextFieldContainer>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Body.Subject.Field.Organization']}
              name="organization"
              ref={node => (this.OrganizationNode = node)}
            />
          </TextFieldContainer>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Body.Subject.Field.OrganizationUnit']}
              name="organizationUnit"
              ref={node => (this.organizationUnitNode = node)}
            />
          </TextFieldContainer>
          <TextFieldContainer>
            <SelectField
              labelText={enLang['CertificateCreate.Body.Subject.Field.Country']}
              placeholder="Select country..."
              name="country"
              ref={node => (this.countryNode = node)}
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
          </TextFieldContainer>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Body.Subject.Field.Region']}
              name="region"
              ref={node => (this.regionNode = node)}
            />
          </TextFieldContainer>
          <TextFieldContainer>
            <TextField
              labelText={enLang['CertificateCreate.Body.Subject.Field.City']}
              name="city"
              ref={node => (this.cityNode = node)}
            />
          </TextFieldContainer>
        </GroupPart>
      </GroupContainer>
    );
  }
}
