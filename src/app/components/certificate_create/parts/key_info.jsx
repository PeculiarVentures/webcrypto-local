import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { SelectField, SelectItem, Checkbox } from '../../basic';
import { Title, GroupContainer, GroupPart } from './styles';
import enLang from '../../../langs/en.json';

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-right: 40px;
  margin-top: 14px;
  &:last-child {
    margin-right: 0;
  }
  @media ${props => props.theme.media.mobile} {
    margin-right: 12px;
    width: calc(50% - 6px);
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
`;

const TitleCheckboxes = styled.div`
  font-size: 12px;
  line-height: 16px;
  display: block;
  width: 100%;
  letter-spacing: 0.04em;
  color: ${props => props.theme.field.text.labelColor};
`;

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
    width: calc(50% - 6px);
    &:nth-child(2n-1) {
      margin-left: 0;
    }
  }
`;

export default class KeyInfo extends Component {

  static propTypes = {
    algorithms: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    keySizes: PropTypes.oneOfType([
      PropTypes.array,
    ]),
  };

  getData = () => {
    const usagesArr = [];
    const usages = {
      encrypt: this.usageEncryptNode.getValue(),
      decrypt: this.usageDecryptNode.getValue(),
      wrapKey: this.usageWrapKeyNode.getValue(),
      unwrapKey: this.usageUnwrapKeyNode.getValue(),
    };

    Object.keys(usages).map((usage) => {
      if (usages[usage]) {
        usagesArr.push(usage);
      }
      return true;
    });

    return {
      keyInfo: {
        algorithm: this.algorithmNode.getData().value,
        size: this.sizeNode.getData().value,
        usages: usagesArr,
      },
    };
  };

  render() {
    const { algorithms, keySizes } = this.props;

    return (
      <GroupContainer>
        <Title>
          { enLang['CertificateCreate.Body.KeyInfo.Title'] }
        </Title>
        <GroupPart>
          <TextFieldContainer>
            <SelectField
              labelText={enLang['CertificateCreate.Body.KeyInfo.Field.Algorithm']}
              name="algorithm"
              ref={node => (this.algorithmNode = node)}
              placeholder="Select algorithm..."
            >
              {
                algorithms.map((item, index) => (
                  <SelectItem
                    key={index}
                    value={item}
                    primaryText={item}
                  />
                ))
              }
            </SelectField>
          </TextFieldContainer>
          <TextFieldContainer>
            <SelectField
              labelText={enLang['CertificateCreate.Body.KeyInfo.Field.Size']}
              name="size"
              ref={node => (this.sizeNode = node)}
              placeholder="Select size..."
            >
              {
                keySizes.map((item, index) => (
                  <SelectItem
                    key={index}
                    value={item}
                    primaryText={item}
                  />
                ))
              }
            </SelectField>
          </TextFieldContainer>
        </GroupPart>
        <GroupPart>
          <TitleCheckboxes>
            { enLang['CertificateCreate.Body.KeyInfo.Usage.Title'] }
          </TitleCheckboxes>
          <CheckboxContainer>
            <Checkbox
              labelText="encrypt"
              ref={node => (this.usageEncryptNode = node)}
            />
          </CheckboxContainer>
          <CheckboxContainer>
            <Checkbox
              labelText="decrypt"
              defaultChecked
              ref={node => (this.usageDecryptNode = node)}
            />
          </CheckboxContainer>
          <CheckboxContainer>
            <Checkbox
              labelText="wrapKey"
              defaultChecked
              ref={node => (this.usageWrapKeyNode = node)}
            />
          </CheckboxContainer>
          <CheckboxContainer>
            <Checkbox
              labelText="unwrapKey"
              defaultChecked
              ref={node => (this.usageUnwrapKeyNode = node)}
            />
          </CheckboxContainer>
        </GroupPart>
      </GroupContainer>
    );
  }
}
