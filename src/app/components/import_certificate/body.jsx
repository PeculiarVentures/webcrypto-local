import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { ACTIONS_CONST } from '../../constants';
import { Button, SelectField, SelectNative, SelectItem, TextField } from '../basic';
import enLang from '../../langs/en.json';
import * as BodyStyled from '../create_certificate/styled/body.styled';

const TextareaContainer = styled.div`
  margin-top: 34px;
  textarea {
    height: 320px;
  }
`;

const BtnsContainer = styled.div`
  margin-top: 28px;
  text-align: right;
`;

const TextFieldContainer = styled.div`
  width: calc(33.3% - 16px);
  @media ${props => props.theme.media.mobile} {
    width: 100%;
  }
`;

export default class Body extends Component {

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
  };

  constructor() {
    super();

    this.fieldNodes = {};
  }

  onSelectChange = (data) => {
    console.log(data);
    // if (typeof data === 'string') {
    // } else {
    // }
  };

  onClickImportHandler = () => {
    const { textarea } = this.fieldNodes;
    const value = textarea.getValue();
    console.log(value);
  };

  render() {
    const { providers } = this.props;
    const { deviceType } = this.context;

    return (
      <BodyStyled.Body>
        <BodyStyled.Container>
          <TextFieldContainer>
            {
              deviceType === 'phone'
                ? <SelectNative
                  labelText={enLang['ImportCertificate.Field.Provider']}
                  placeholder="Select provider..."
                  ref={node => (this.fieldNodes.format = node)}
                  options={providers.map(item => ({
                    value: item.id,
                    name: item.name,
                  }))}
                  defaultValue={providers[0].id || ''}
                  onChange={this.onSelectChange}
                />
                : <SelectField
                  labelText={enLang['ImportCertificate.Field.Provider']}
                  ref={node => (this.fieldNodes.format = node)}
                  placeholder="Select provider..."
                  defaultSelected={{
                    name: providers[0].name || '',
                    value: providers[0].id || '',
                    index: 0,
                  }}
                  onChange={this.onSelectChange}
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
          <TextareaContainer>
            <TextField
              labelText={enLang['ImportCertificate.Field.Certificate']}
              multiline
              ref={node => (this.fieldNodes.textarea = node)}
            />
          </TextareaContainer>
          <BtnsContainer>
            <Button
              primary
              onClick={this.onClickImportHandler}
            >
              { enLang['ImportCertificate.Btn.Import'] }
            </Button>
          </BtnsContainer>
        </BodyStyled.Container>
      </BodyStyled.Body>
    );
  }
}
