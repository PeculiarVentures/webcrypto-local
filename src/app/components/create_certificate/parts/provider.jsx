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

  render() {
    const { providers } = this.props;
    const { deviceType, dispatch } = this.context;

    const selectedProvider = providers.filter(obj => obj.selected);
    const notReadOnlyProviders = providers.filter(obj => !obj.readOnly);
    const currentProvider = selectedProvider.length
      ? selectedProvider[0]
      : false;

    // select another provider if current provider readOnly
    if (currentProvider && currentProvider.readOnly) {
      dispatch(ProviderActions.select(notReadOnlyProviders[0].id));
    }

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
                  options={notReadOnlyProviders.map(item => ({
                    value: item.id,
                    name: item.name,
                  }))}
                  value={currentProvider ? currentProvider.id : ''}
                  onChange={this.onSelectHandler}
                />
                : <SelectField
                  labelText={enLang['CertificateCreate.Provider.Field.Name']}
                  placeholder={enLang['Select.Label.Provider']}
                  value={{
                    name: currentProvider ? currentProvider.name : '',
                    value: currentProvider ? currentProvider.id : '',
                    index: currentProvider ? currentProvider.index : null,
                  }}
                  disabled={!providers.length}
                  onChange={this.onSelectHandler}
                >
                  {
                    notReadOnlyProviders.map((item, index) => (
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
