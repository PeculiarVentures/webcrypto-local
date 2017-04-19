import React, { PropTypes, Component } from 'react';
import { SelectField, SelectItem, SelectNative } from '../basic';
import { ModalActions } from '../../actions/ui';
import { ProviderActions, AppActions } from '../../actions/state';
import enLang from '../../langs/en.json';
import * as HeaderStyled from './styled/header.styled';

export default class SidebarHeader extends Component {

  static propTypes = {
    loaded: PropTypes.bool,
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    loaded: false,
    providers: [],
    readOnly: false,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
    deviceType: PropTypes.string,
  };

  onClickCreateHandler = () => {
    const { dispatch } = this.context;
    dispatch(AppActions.create(true));
  };

  onClickImportHandler = () => {
    const { dispatch } = this.context;
    dispatch(ModalActions.open('import_certificate'));
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
    const { loaded, providers, readOnly } = this.props;
    const { deviceType } = this.context;
    const selectedProvider = providers.filter(obj => obj.selected);
    const currentProvider = selectedProvider.length
      ? selectedProvider[0]
      : false;

    return (
      <HeaderStyled.SidebarHeader>
        <HeaderStyled.BtnsContainer>
          <HeaderStyled.Btn
            disabled={!loaded || readOnly}
            primary
            onClick={this.onClickImportHandler}
          >
            <HeaderStyled.ImportIc />
            { enLang['Sidebar.Header.Btn.Import'] }
          </HeaderStyled.Btn>
          <HeaderStyled.Btn
            disabled={!loaded || readOnly}
            primary
            onClick={this.onClickCreateHandler}
          >
            <HeaderStyled.CreateIc />
            { enLang['Sidebar.Header.Btn.Create'] }
          </HeaderStyled.Btn>
        </HeaderStyled.BtnsContainer>
        <HeaderStyled.SelectContainer disabled={!providers.length}>
          {
            deviceType === 'phone'
              ? <SelectNative
                labelText={enLang['CertificateCreate.Provider.Field.Name']}
                placeholder={enLang['Select.Label.Provider']}
                options={providers.map(item => ({
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
        </HeaderStyled.SelectContainer>
      </HeaderStyled.SidebarHeader>
    );
  }
}
