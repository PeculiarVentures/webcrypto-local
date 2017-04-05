import { colorManipulator, stylesMixins } from '../helpers';

export const defaultPalette = {
  primaryColor: '#282E32',
  secondaryColor: '#3D4346',
  secondaryTextColor1: '#97A1A9',
  secondaryTextColor2: '#EFEFEF',
  white: '#ffffff',
  black: '#000000',
  gray: '#EBEDEF',
  secondaryGray: '#9CA6AE',
  primaryButtonColor: '#77D042',
  secondaryButtonColor: '#009CFB',
  errorColor: '#D92323',
  statusOnline: '#65BB22',
};

const media = {
  tablet: '(max-width: 1024px)',
  mobile: '(max-width: 737px)',
  mobileLandscape: '(max-width: 737px) and (orientation: landscape)',
};

export function getTheme(palette = defaultPalette) {
  return {
    mixins: stylesMixins,
    media,
    palette,
    shadows: {
      snackbar: `0px 2px 30px 0px ${colorManipulator.fade(palette.black, 0.1)}`,
      sidebarHeader: `box-shadow: 0px 2px 20px 0px ${colorManipulator.fade(palette.black, 0.1)}`,
    },
    borderRadius: 3,
    basicTransition: 300,
    fontName: '"Open Sans", Arial',
    tooltip: {
      borderColor: colorManipulator.fade(palette.secondaryButtonColor, 0.5),
      background: palette.white,
    },
    button: {
      primary: {
        color: palette.white,
        background: palette.primaryButtonColor,
        borderColor: palette.primaryButtonColor,
      },
      secondary: {
        color: palette.secondaryButtonColor,
        borderColor: colorManipulator.fade(palette.secondaryButtonColor, 0.5),
        background: palette.white,
      },
      default: {
        color: palette.secondaryTextColor1,
        borderColor: colorManipulator.fade(palette.secondaryTextColor1, 0.5),
        background: '#FCFCFC',
      },
      disabled: {
        color: palette.secondaryTextColor1,
        borderColor: '#F7F8F9',
        background: '#F7F8F9',
      },
    },
    snackbar: {
      color: '#40484F',
      backgroundColor: defaultPalette.white,
      borderColor: defaultPalette.secondaryButtonColor,
      shadow: `0px 2px 30px 0px ${colorManipulator.fade(palette.black, 0.1)}`,
      error: {
        borderColor: colorManipulator.fade(defaultPalette.errorColor, 0.5),
      },
    },
    field: {
      text: {
        borderColor: colorManipulator.fade(palette.secondaryTextColor1, 0.5),
        borderColorActive: colorManipulator.fade(palette.secondaryButtonColor, 0.5),
        borderColorDisabled: colorManipulator.fade(palette.secondaryTextColor1, 0.3),
        borderColorInvalid: colorManipulator.fade(palette.errorColor, 0.5),
        color: palette.primaryColor,
        colorDisabled: colorManipulator.fade(palette.primaryColor, 0.5),
        colorInvalid: colorManipulator.fade(palette.errorColor, 0.8),
        placeholderColor: colorManipulator.fade(palette.secondaryTextColor1, 0.8),
        placeholderColorDisabled: colorManipulator.fade(palette.secondaryTextColor1, 0.5),
        labelColor: palette.secondaryTextColor1,
      },
      select: {
        iconColor: palette.secondaryButtonColor,
        backgroundDropdown: palette.white,
        borderColorDropdown: colorManipulator.fade(palette.secondaryTextColor1, 0.5),
        borderColorDropdownItem: colorManipulator.fade(palette.secondaryTextColor1, 0.3),
        colorDropdownItem: palette.primaryColor,
        colorDropdownItemSelected: palette.secondaryButtonColor,
      },
    },
    checkbox: {
      borderColor: colorManipulator.fade(palette.secondaryTextColor1, 0.5),
      borderColorActive: colorManipulator.fade(palette.secondaryButtonColor, 0.5),
      borderColorDisabled: colorManipulator.fade(palette.secondaryTextColor1, 0.3),
      color: palette.primaryColor,
      colorDisabled: colorManipulator.fade(palette.primaryColor, 0.5),
      iconColor: palette.secondaryButtonColor,
    },
    dialog: {
      backgroundOverlay: colorManipulator.fade(palette.primaryColor, 0.8),
      background: palette.white,
      borderColor: palette.secondaryTextColor1,
      color: palette.primaryColor,
      colorDescr: colorManipulator.fade(palette.primaryColor, 0.7),
      authorization: {
        borderColorNumber: colorManipulator.fade(palette.secondaryTextColor1, 0.4),
      },
    },
    info: {
      header: {
        titleColor: palette.primaryColor,
        borderColor: palette.gray,
        burgerColor: palette.secondaryGray,
        activeBurgerColor: palette.secondaryButtonColor,
        dropdownColor: colorManipulator.fade(palette.white, 0.95),
        dropdownItemColor: palette.secondaryButtonColor,
        arrowBackColor: '#9CA6AE',
      },
      infoTable: {
        rowBorderColor: palette.gray,
        mainTitleColor: palette.primaryColor,
        subTitleColor: palette.secondaryTextColor1,
        valueColor: palette.primaryColor,
      },
      empty: {
        color: colorManipulator.fade(palette.primaryColor, 0.5),
      },
    },
    sidebar: {
      background: palette.primaryColor,
      backgroundHeader: palette.secondaryColor,
      borderColorFooter: palette.secondaryColor,
      borderColorCert: palette.secondaryColor,
      colorFooter: colorManipulator.fade(palette.white, 0.7),
      iconStatusOnline: palette.statusOnline,
      iconStatusOffline: palette.errorColor,
      iconStatusSeaching: '#FFC325',
      colorCertName: palette.secondaryTextColor2,
      colorCertDescr: colorManipulator.fade(palette.secondaryTextColor2, 0.7),
      backgroundCertActive: palette.secondaryColor,
      colorEmpty: palette.secondaryTextColor2,
    },
    certificateCreate: {
      background: palette.white,
      colorHeader: palette.primaryColor,
      colorBodyTitle: palette.primaryColor,
      borderColorHeader: palette.secondaryTextColor2,
      borderColorBodyGroup: palette.secondaryTextColor2,
    },
  };
}
