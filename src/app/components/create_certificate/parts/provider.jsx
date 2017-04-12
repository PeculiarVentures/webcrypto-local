import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { SelectField, SelectItem, SelectNative } from '../../basic';
import { ProviderActions } from '../../../actions/state';
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

export default class Provider extends Component {

  static propTypes = {
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
  };

  static defaultProps = {
    providers: [],
  };

  static contextTypes = {
    deviceType: PropTypes.string,
    dispatch: PropTypes.func,
  };

  onSelectHandler = (data) => {
    const { dispatch } = this.context;
    if (typeof data === 'string') {
      dispatch(ProviderActions.select(data));
    } else {
      dispatch(ProviderActions.select(data.value));
    }
  };

  getSelectedProviderProps() {
    const { providers } = this.props;
    let provider = false;

    providers.map((prv) => {
      if (prv.selected) {
        provider = prv;
      }
      return true;
    });

    return provider;
  }

  render() {
    const { providers } = this.props;
    const { deviceType } = this.context;
    const selectedProvider = this.getSelectedProviderProps();

    return (
      <GroupContainer>
        <Title>
          { enLang['CertificateCreate.Provider.Title'] }
        </Title>
        <GroupPart>
          <TextFieldContainer>
            {
              deviceType === 'phone'
                ? <SelectNative
                  labelText={enLang['CertificateCreate.Provider.Field.Name']}
                  placeholder={enLang['Select.Label.Provider']}
                  options={providers.map(item => ({
                    value: item.id,
                    name: item.name,
                  }))}
                  defaultValue={selectedProvider ? selectedProvider.id : ''}
                  onChange={this.onSelectHandler}
                />
                : <SelectField
                  labelText={enLang['CertificateCreate.Provider.Field.Name']}
                  placeholder={enLang['Select.Label.Provider']}
                  defaultSelected={{
                    name: selectedProvider ? selectedProvider.name : '',
                    value: selectedProvider ? selectedProvider.id : '',
                    index: selectedProvider ? selectedProvider.index : 0,
                  }}
                  disabled={!providers.length}
                  onChange={this.onSelectHandler}
                >
                  {
                    providers.map((item, index) => (
                      <SelectItem
                        key={index}
                        value={item.id}
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
