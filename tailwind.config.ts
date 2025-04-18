/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export const content = [
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  './src/common/components/**/*.{js,ts,jsx,tsx,mdx}'
]
export const theme = {
  fontFamily: {
    heading: ['var(--heading-font)', ...defaultTheme.fontFamily.sans],
    body: ['var(--body-font)', ...defaultTheme.fontFamily.sans]
  },
  backgroundImage: {
    'gradient-10': 'linear-gradient(90deg, #D01380 0%, #D9459B 100%)',
    'gradient-20':
      'linear-gradient(37deg, #9B0F60 0%, #AE116C 75.65%, #D01380 100%)',
    'gradient-50':
      'linear-gradient(33deg, #D01380 0%, #D9459B 62.02%, #F8E3F0 100%, #EBAAD3 100%)',
    ...defaultTheme.backgroundImage
  },
  colors: {
    current: 'currentColor',
    transparent: 'transparent',
    primary: {
      DEFAULT: '#D01380',
      10: '#F8E3F0',
      20: '#EBAAD3',
      30: '#E275B6',
      40: '#D9459B',
      50: '#D01380',
      60: '#AE116C',
      70: '#9B0F60',
      80: '#710945',
      90: '#44072A'
    },
    secondary: {
      DEFAULT: '#333333',
      10: '#A9A9A9',
      20: '#8C8C8C',
      30: '#6E6E6E',
      40: '#515151',
      50: '#333333',
      60: '#292929',
      70: '#191919',
      80: '#101010',
      90: '#0C0C0C',
      100: '#000000'
    },
    error: {
      DEFAULT: '#DE3730',
      10: '#410002',
      20: '#690005',
      30: '#93000A',
      40: '#BA1A1A',
      50: '#DE3730',
      60: '#FF5449',
      70: '#FF897D',
      80: '#FFB4AB',
      90: '#FFDAD6'
    },
    neutral: {
      DEFAULT: '#949494',
      10: '#000000',
      20: '#1E1E1E',
      30: '#3B3B3B',
      40: '#767676',
      50: '#949494',
      60: '#A9A9A9',
      70: '#BFBFBF',
      80: '#D4D4D4',
      90: '#DFDFDF',
      95: '#EAEAEA',
      99: '#F4F4F4',
      100: '#FFFFFF'
    },
    blue: {
      DEFAULT: '#0970CD',
      10: '#BDE2FF',
      20: '#92D1FF',
      30: '#41AFFF',
      40: '#1693F2',
      50: '#0970CD',
      60: '#0050AE'
    },
    green: {
      DEFAULT: '#0DA05F',
      10: '#98D6B3',
      20: '#6CC796',
      30: '#48BB80',
      40: '#17AF6A',
      50: '#0DA05F',
      60: '#008E53'
    },
    sunset: {
      DEFAULT: '#FE8E00',
      10: '#FFECB3',
      20: '#FFDF82',
      30: '#FEC927',
      40: '#FEB200',
      50: '#FE8E00',
      60: '#FE6E00'
    },
    warning: {
      DEFAULT: '#E24704',
      10: '#FC875D',
      20: '#FB6D38',
      30: '#FA540F',
      40: '#EF4E0A',
      50: '#E24704',
      60: '#D44000'
    }
  },
  screens: {
    xs: '320px',
    sm: '768px',
    md: '1024px',
    lg: '1366px',
    xl: '1440px'
  },
  boxShadow: {
    none: '0px',
    slight: '0px 1px 4px 0px rgba(77, 18, 50, 0.12)',
    skim: '0px 6px 6px 0px rgba(102, 112, 122, 0.10)',
    lifted: '0px 12px 12px 0px rgba(102, 112, 122, 0.10)',
    raise: '0px 10px 24px 0px rgba(102, 112, 122, 0.10)',
    main: '0px 4px 30px 0px rgba(0, 0, 0, 0.10)'
  },
  fontSize: {
    title: ['46px', { letterSpacing: '-0.92px' }],
    'heading-1': ['40px', { letterSpacing: '-0.8px' }],
    'heading-2': ['36px', { letterSpacing: '-0.72px' }],
    'heading-3': ['28px', { letterSpacing: '-0.56px' }],
    'heading-4': ['24px', { letterSpacing: '-0.48px' }],
    'heading-5': ['20px', { letterSpacing: '-0.4px' }],
    'body-1': ['18px', { letterSpacing: '-0.36px' }],
    'body-2': ['16px', { letterSpacing: '-0.32px' }],
    'body-3': ['14px', { letterSpacing: '-0.28px' }],
    'body-4': ['12px', { letterSpacing: '-0.24px' }],
    'body-5': ['10px', { letterSpacing: '-0.20px' }]
  }
}
