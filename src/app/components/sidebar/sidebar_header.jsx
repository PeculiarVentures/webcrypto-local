import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Button } from '../basic';
import { ImportIcon, CreateIcon } from '../svg';
import { RoutingActions } from '../../actions/ui';
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
  cursor: pointer;
`;

const SidebarHeaderStyled = styled.div`
  height: 84px;
  padding: 24px 30px;
  background: ${props => props.theme.sidebar.backgroundHeader};
  box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.10);
  z-index: 1;
  position: relative;
  @media ${props => props.theme.media.mobile} {
    height: 56px;
    padding: 12px;
  }
`;

export default class SidebarHeader extends Component {

  static contextTypes = {
    dispatch: PropTypes.func,
    windowSize: PropTypes.object,
  };

  onClickCreateHandler = () => {
    const { dispatch } = this.context;
    dispatch(RoutingActions.push('create'));
  };

  onChangeInputFile = (event) => {
    event.preventDefault();
    const filesArray = event.target.files;
    const promises = [];

    for (let i = 0; i < filesArray.length; i += 1) {
      const reader = new FileReader();
      const file = filesArray[i];

      if (AccessedMimes.indexOf(file.type) === -1) {
        continue;
      }

      promises.push(new Promise((resolve) => {
        reader.onload = (e) => {
          const nameParts = file.name.split('.');

          resolve({
            file: e.target.result,
            name: nameParts[0],
            extension: nameParts[nameParts.length - 1],
            type: file.type,
          });
        };

        reader.readAsArrayBuffer(file);
      }));
    }

    return Promise.all(promises).then((files) => {
      console.log('files', files);
    });
  };

  getAcceptString() {
    if (this.context.windowSize.device === 'desktop') {
      return AccessedMimes.join(',');
    }
    return AccessedExtentions.map(e => `.${e}`).join(', ');
  }

  render() {
    const acceptString = this.getAcceptString();

    return (
      <SidebarHeaderStyled>
        <ButtonStyled
          primary
        >
          <InputFileStyled
            type="file"
            accept={acceptString}
            multiple
            onChange={this.onChangeInputFile}
          />
          <ImportIconStyled />
          { enLang['Sidebar.Header.Btn.Import'] }
        </ButtonStyled>
        <ButtonStyled
          primary
          onClick={this.onClickCreateHandler}
        >
          <CreateIconStyled />
          { enLang['Sidebar.Header.Btn.Create'] }
        </ButtonStyled>
      </SidebarHeaderStyled>
    );
  }
}
