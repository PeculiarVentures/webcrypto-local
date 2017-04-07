import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import Clipboard from 'clipboard';
import { ACTIONS_CONST } from '../../constants';
import { EventChannel } from '../../controllers';
import { Button, SelectField, SelectNative, SelectItem, TextField } from '../basic';
import enLang from '../../langs/en.json';
import * as BodyStyled from '../create_certificate/styled/body.styled';

const TextareaContainer = styled.div`
  margin-top: 34px;
  textarea {
    height: 320px;
    font-family: Monaco, monospace !important;
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
    formats: PropTypes.oneOfType([
      PropTypes.array,
    ]),
  };

  static defaultProps = {
    formats: [
      {
        name: 'PEM',
        value: 'pem',
        index: 0,
      },
      {
        name: 'DER',
        value: 'der',
        index: 1,
      },
    ],
  };

  static contextTypes = {
    deviceType: PropTypes.string,
  };

  constructor() {
    super();

    this.state = {
      copiedData: {
        pem: '',
        der: '',
      },
      currentData: '',
    };

    this.fieldNodes = {};
    this.clipboard = '';

    EventChannel.on(ACTIONS_CONST.CERTIFICATE_COPIED_DATA, this.onCopiedData);
  }

  componentDidMount() {
    this.clipboard = new Clipboard('#copied_btn');
    this.clipboard.on('success', (e) => {
      this.onSuccesCopy();
      e.clearSelection();
    });
    this.forceUpdate();
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  onCopiedData = (data) => {
    if (data) {
      this.setState({
        currentData: data.pem,
        copiedData: data,
      });
    }
  };

  onSuccesCopy = () => {
    EventChannel.emit(ACTIONS_CONST.SNACKBAR_SHOW, 'copied', 3000);
  };

  onFormatChange = (data) => {
    if (typeof data === 'string') {
      this.setState({
        currentData: this.state.copiedData[data],
      });
    } else {
      this.setState({
        currentData: this.state.copiedData[data.value],
      });
    }
  };

  render() {
    const { formats } = this.props;
    const { currentData } = this.state;
    const { deviceType } = this.context;

    return (
      <BodyStyled.Body>
        <BodyStyled.Container>
          <TextFieldContainer>
            {
              deviceType === 'phone'
                ? <SelectNative
                  labelText={enLang['CopyCertificate.Field.Format']}
                  placeholder="Select format..."
                  ref={node => (this.fieldNodes.format = node)}
                  options={formats.map(f => ({
                    value: f.value,
                    name: f.name,
                  }))}
                  defaultValue={formats[0].value}
                  onChange={this.onFormatChange}
                />
                : <SelectField
                  labelText={enLang['CopyCertificate.Field.Format']}
                  ref={node => (this.fieldNodes.format = node)}
                  placeholder="Select format..."
                  defaultSelected={formats[0]}
                  onChange={this.onFormatChange}
                >
                  {
                    formats.map((item, index) => (
                      <SelectItem
                        key={index}
                        value={item.value}
                        primaryText={item.name}
                      />
                    ))
                  }
                </SelectField>
            }
          </TextFieldContainer>
          <TextareaContainer>
            <TextField
              labelText={enLang['CopyCertificate.Field.Certificate']}
              multiline
              value={currentData}
              readOnly
              ref={node => (this.fieldNodes.textarea = node)}
            />
          </TextareaContainer>
          <BtnsContainer>
            <Button
              primary
              id="copied_btn"
              data-clipboard-target={
                {}.hasOwnProperty.call(this.fieldNodes, 'textarea')
                  ? `#${this.fieldNodes.textarea.fieldId}`
                  : ''
              }
            >
              { enLang['CopyCertificate.Btn.Copy'] }
            </Button>
          </BtnsContainer>
        </BodyStyled.Container>
      </BodyStyled.Body>
    );
  }
}
