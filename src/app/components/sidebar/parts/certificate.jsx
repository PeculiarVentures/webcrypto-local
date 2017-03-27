import React, { PropTypes } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { CertificateActions } from '../../../actions/state';
import { DocCertIcon, DocRequestIcon, DocKeyIcon } from '../../svg';

const AlgName = styled.div`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.02em;
  margin-top: 1px;
  display: inline-block;
  vertical-align: top;
  ${props => props.theme.mixins.truncateText}
  width: calc(100% - 85px);
  padding-right: 5px;
  color: ${props => props.theme.sidebar.colorCertDescr};
  @media ${props => props.theme.media.mobile} {
    font-size: 11px;
  }
`;

const Date = styled(AlgName)`
  width: 85px;
  padding-right: 0;
  text-align: right;
`;

const Name = styled.div`
  font-size: 16px;
  line-height: 22px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: ${props => props.theme.sidebar.colorCertName};
  ${props => props.theme.mixins.truncateText}
`;

const CertDescrStyled = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-left: 16px;
  width: calc(100% - 16px - 46px);
  @media ${props => props.theme.media.mobile} {
    margin-left: 10px;
    width: calc(100% - 10px - 46px);
  }
`;

const ContainerStyled = styled.div`
  font-size: 0;
  padding: 27px 0;
  border-bottom: 1px solid ${props => props.theme.sidebar.borderColorCert};
  @media ${props => props.theme.media.mobileLandscape} {
    padding: 16px 0;
  }
`;

const IconStyled = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 46px;
`;

const CertificateStyled = styled.div`
  cursor: ${props => (
    props.selected
      ? 'default'
      : 'pointer'
  )};
  padding: 0 20px;
  transition: background ${props => props.theme.basicTransition}ms;
  background: ${props => (
    props.selected
      ? props.theme.sidebar.backgroundCertActive
      : 'transparent'
  )};
  &:hover {
    background: ${props => props.theme.sidebar.backgroundCertActive};
  }
  margin-top: -1px;
  @media ${props => props.theme.media.mobileLandscape} {
    padding: 0 15px;
  }
`;

const Certificate = (props, context) => {
  const {
    id,
    name,
    type,
    algorithm,
    startDate,
    selected,
  } = props;
  const { dispatch, handleRootAction } = context;

  const onClickhandler = () => {
    handleRootAction({
      type: 'SIDEBAR:CLOSE',
    });
    if (!selected) {
      dispatch(CertificateActions.select(id));
    }
  };

  const renderIcon = (certType) => {
    switch (certType) {
      case 'request':
        return <DocRequestIcon />;
      case 'certificate':
        return <DocCertIcon />;
      case 'key':
        return <DocKeyIcon />;
      default:
        return <DocCertIcon />;
    }
  };

  return (
    <CertificateStyled
      selected={selected}
      onClick={onClickhandler}
    >
      <ContainerStyled>
        <IconStyled>
          { renderIcon(type) }
        </IconStyled>
        <CertDescrStyled>
          <Name>
            { name }
          </Name>
          <AlgName>
            { algorithm }
          </AlgName>
          <Date>
            {
              startDate
                ? moment(parseInt(startDate)).format('D MMM YYYY')
                : null
            }
          </Date>
        </CertDescrStyled>
      </ContainerStyled>
    </CertificateStyled>
  );
};

Certificate.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  algorithm: PropTypes.string,
  startDate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  selected: PropTypes.bool,
};

Certificate.contextTypes = {
  dispatch: PropTypes.func,
  handleRootAction: PropTypes.func,
};

export default Certificate;
