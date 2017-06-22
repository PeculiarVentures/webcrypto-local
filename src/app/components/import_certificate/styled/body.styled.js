import styled from 'styled-components';

export const InputFileContainer = styled.div`
  float: left;
`;

export const LabelStyled = styled.label`
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.095em;
  transition: opacity ${props => props.theme.basicTransition}ms;
  cursor: pointer;
  color: ${props => props.theme.import.colorFile};
  padding: 9px 0;
  display: block;
  &:hover {
    opacity: 0.6;
  }
`;

export const TextareaContainer = styled.div`
  margin-top: 34px;
  textarea {
    height: 320px;
    font-family: Monaco, monospace !important;
  }
`;

export const BtnsContainer = styled.div`
  margin-top: 28px;
  button {
    float: right;
  }
  ${props => props.theme.mixins.clear}
`;

export const TextFieldContainer = styled.div`
  width: calc(33.3% - 16px);
  @media ${props => props.theme.media.mobile} {
    width: 100%;
  }
`;
