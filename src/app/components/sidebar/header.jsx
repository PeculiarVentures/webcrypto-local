import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Button, SelectField, SelectItem, SelectNative } from '../basic';
import { ImportIcon, CreateIcon } from '../svg';
import { RoutingActions } from '../../actions/ui';
import { ProviderActions } from '../../actions/state';
import { AccessedMimes, AccessedExtentions } from '../../constants/acessed_types';
import enLang from '../../langs/en.json';

const CreateIconStyled = styled(CreateIcon)`
  width: 14px;
  margin-top: -3px;
`;

const ImportIconStyled = styled(ImportIcon)`
  width: 17px;
  margin-top: -2px;
`;

const BtnsContainer = styled.div`
  background: ${props => props.theme.sidebar.backgroundHeader};
  padding: 24px 30px;
  @media ${props => props.theme.media.mobile} {
    padding: 12px;
  }
`;

const SelectContainer = styled.div`
  padding: 24px 25px 8px;
  @media ${props => props.theme.media.mobile} {
    padding: 13px 12px 5px;
  }
`;

const ButtonStyled = styled(Button)`
  margin-left: 6px;
  width: calc(50% - 3px);
  padding: 0 10px !important;
  &:first-child {
    margin-left: 0;
  }
  position: relative;
`;

const InputFileStyled = styled.input`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: ${props => (
    props.disabled
      ? 'default'
      : 'pointer'
  )};
`;

const SidebarHeaderStyled = styled.div`
  height: 164px;
  z-index: 1;
  position: relative;
  @media ${props => props.theme.media.mobile} {
    height: 122px;
  }
`;

export default class SidebarHeader extends Component {

  static propTypes = {
    dataLoaded: PropTypes.bool,
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
  };

  static defaultProps = {
    dataLoaded: false,
    providers: [],
  };

  static contextTypes = {
    dispatch: PropTypes.func,
    deviceType: PropTypes.string,
  };

  onClickCreateHandler = () => {
    const { dispatch } = this.context;
    dispatch(RoutingActions.push('create'));
  };

  onChangeInputFile = (event) => {
    event.preventDefault();
    console.log(event.target.files);
    // event.preventDefault();
    // const filesArray = event.target.files;
    // const promises = [];
    //
    // for (let i = 0; i < filesArray.length; i += 1) {
    //   const reader = new FileReader();
    //   const file = filesArray[i];
    //
    //   if (AccessedMimes.indexOf(file.type) === -1) {
    //     continue;
    //   }
    //
    //   promises.push(new Promise((resolve) => {
    //     reader.onload = (e) => {
    //       const nameParts = file.name.split('.');
    //
    //       resolve({
    //         file: e.target.result,
    //         name: nameParts[0],
    //         extension: nameParts[nameParts.length - 1],
    //         type: file.type,
    //       });
    //     };
    //
    //     reader.readAsArrayBuffer(file);
    //   }));
    // }
    //
    // return Promise.all(promises).then((files) => {
    //   console.log('files', files);
    // });
  };

  getAcceptString() {
    const { deviceType } = this.context;
    if (deviceType === 'desktop') {
      return AccessedMimes.join(',');
    }
    return AccessedExtentions.map(e => `.${e}`).join(', ');
  }

  onSelectHandler = (data) => {
    const { dispatch } = this.context;
    dispatch(ProviderActions.select(data.value));
  };

  render() {
    const { dataLoaded, providers } = this.props;
    const { deviceType } = this.context;
    const acceptString = this.getAcceptString();
    const selectedProvider = providers.filter(obj => obj.selected);
    const currentProvider = selectedProvider.length
      ? selectedProvider[0]
      : false;

    return (
      <SidebarHeaderStyled>
        <BtnsContainer>
          <ButtonStyled
            disabled={!dataLoaded}
            primary
          >
            <InputFileStyled
              type="file"
              disabled={!dataLoaded}
              accept={acceptString}
              multiple
              onChange={this.onChangeInputFile}
            />
            <ImportIconStyled />
            { enLang['Sidebar.Header.Btn.Import'] }
          </ButtonStyled>
          <ButtonStyled
            disabled={!dataLoaded}
            primary
            onClick={this.onClickCreateHandler}
          >
            <CreateIconStyled />
            { enLang['Sidebar.Header.Btn.Create'] }
          </ButtonStyled>
        </BtnsContainer>
        <SelectContainer>
          {
            deviceType === 'phone'
              ? <SelectNative
                labelText={enLang['CertificateCreate.Provider.Field.Name']}
                placeholder="Select provider..."
                options={providers.map(item => ({
                  value: item.id,
                  name: item.name,
                }))}
                value={currentProvider ? currentProvider.id : ''}
              />
              : <SelectField
                labelText={enLang['CertificateCreate.Provider.Field.Name']}
                placeholder="Select provider..."
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
        </SelectContainer>
      </SidebarHeaderStyled>
    );
  }
}
