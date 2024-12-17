import { alpha } from '@mui/material/styles';

const themeColor = localStorage.getItem('themeColor');

const isgrayTheme = themeColor === 'gray';
const isYellowTheme = themeColor === 'yellow'
const isMintBlueTheme = themeColor === 'mintBlue'
const isBlueTheme = themeColor === 'blue'

let theme;

// ----------------------------------------------------------------------

// SETUP COLORS

export const grey = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

export const voilet = {
  lighter: '#ccc1d9',
  light: '#b59ad6',
  main: '#8548D0',
  mainSecondary: '#29BFFF',
  dark: '#6e19d1',
  darker: '#5002ab',
  contrastText: '#FFFFFF',
}

export const blue = {
  lighter: '#D0ECFE',
  light: '#73BAFB',
  main: '#1675f2',
  mainSecondary: '#1675f2',
  dark: '#0C44AE',
  darker: '#042174',
  contrastText: '#FFFFFF',
}

export const gray = {
  lighter: '#c8d6e3',
  light: '#97acbf',
  main: '#738FA7',
  mainSecondary: '#9fabb5',
  dark: '#54697a',
  darker: '#37444f',
  contrastText: '#FFFFFF',
};

export const yellow = {
  lighter: '#fce2ae',
  light: '#e3c488',
  main: '#91794a',
  mainSecondary: '#bda982',
  dark: '#78643e',
  darker: '#52442a',
  contrastText: '#FFFFFF',
};

export const mintBlue = {
  lighter: '#dbffff',
  light: '#c0fcfc',
  main: '#429E9D',
  mainSecondary: '#82b5b5',
  dark: '#347E7D',
  darker: '#275D5D',
  contrastText: '#FFFFFF',
};

if (isgrayTheme) {
  theme = gray;
} else if (isYellowTheme) {
  theme = yellow;
} else if (isMintBlueTheme) {
  theme = mintBlue;
} else if (isBlueTheme) {
  theme = blue;
} else {
  theme = voilet;
}

export const primary = theme

export const secondary = {
  lighter: '#EFD6FF',
  light: '#C684FF',
  main: '#8E33FF',
  dark: '#5119B7',
  darker: '#27097A',
  contrastText: '#FFFFFF',
};

export const info = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#FFFFFF',
};

export const success = {
  lighter: '#C8FAD6',
  light: '#5BE49B',
  main: '#00A76F',
  dark: '#007867',
  darker: '#004B50',
  contrastText: '#FFFFFF',
};

export const warning = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: grey[800],
};

export const error = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};

export const common = {
  black: '#000000',
  white: '#FFFFFF',
};

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const base = {
  primary,
  gray,
  blue,
  voilet,
  yellow,
  mintBlue,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
};

// ----------------------------------------------------------------------

export function palette() {
  return {
    ...base,
    mode: 'light',
    text: {
      primary: grey[800],
      secondary: grey[600],
      disabled: grey[500],
    },
    background: {
      paper: '#FFFFFF',
      default: grey[100],
      neutral: grey[200],
    },
    action: {
      ...base.action,
      active: grey[600],
    },
  };
}
