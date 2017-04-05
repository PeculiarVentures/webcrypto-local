import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Dialog, SelectField, SelectNative, SelectItem } from '../basic';
import enLang from '../../langs/en.json';

const Container = styled.div`
  text-align: left;
  margin: 35px auto 0;
  max-width: 270px;
`;

export default class SelectProviderDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
    providers: PropTypes.oneOfType([
      PropTypes.array.isRequired,
    ]),
  };

  static defaultProps = {
    providers: [],
  };

  static contextTypes = {
    deviceType: PropTypes.string,
  };

  onAcceptHandler = () => {
    const { onAccept } = this.props;
    const { selectNode } = this;
    let providerIndex = 0;

    if ({}.hasOwnProperty.call(selectNode, 'getData')) {
      providerIndex = selectNode.getData().value;
    } else {
      providerIndex = selectNode.getValue();
    }

    if (onAccept) {
      onAccept(providerIndex);
    }
  };

  render() {
    const { providers } = this.props;
    const { deviceType } = this.context;

    return (
      <Dialog
        title={enLang['Dialog.SelectProvider.Title']}
        acceptText={enLang['Dialog.SelectProvider.Btn.Accept']}
        onAccept={this.onAcceptHandler}
        btnAcceptProps={{
          disabled: !providers.length,
        }}
        cancelText={''}
      >
        <Container>
          {
            deviceType === 'phone'
              ? <SelectNative
                labelText={enLang['Dialog.SelectProvider.Field.Name']}
                placeholder="Select provider..."
                options={providers.map(item => ({
                  value: item.id,
                  name: item.name,
                }))}
                defaultValue={providers[0] ? providers[0].name : ''}
                ref={node => (this.selectNode = node)}
                disabled={!providers.length}
              />
              : <SelectField
                labelText={enLang['Dialog.SelectProvider.Field.Name']}
                name="exponent"
                placeholder="Select provider..."
                defaultSelected={{
                  name: providers[0] ? providers[0].name : '',
                  value: providers[0] ? providers[0].id : '',
                  index: 0,
                }}
                disabled={!providers.length}
                ref={node => (this.selectNode = node)}
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
        </Container>
      </Dialog>
    );
  }
}
