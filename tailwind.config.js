const { spacing, fontFamily } = require('tailwindcss/defaultTheme');

// some fontSizes return [size, props], others just size :/
const fontSize = size => {
  const result = theme(`fontSize.${size}`)
  return Array.isArray(result) ? result[0] : result
}

const breakout = {
  marginLeft: 0,
  marginRight: 0,
  gridColumn: '2 / span 10',
}


module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'blue-opaque': 'rgb(13 42 148 / 18%)',
        gray: {
          0: '#fff',
          100: '#fafafa',
          200: '#eaeaea',
          300: '#999999',
          400: '#888888',
          500: '#666666',
          600: '#444444',
          700: '#333333',
          800: '#222222',
          900: '#111111'
        }
      },
      fontFamily: {
        sans: ['Work Sans', ...fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.blue.500'),
              '&:hover': {
                color: theme('colors.blue.700')
              },
              code: { color: theme('colors.blue.400') }
            },
            'h2,h3,h4': {
              'scroll-margin-top': spacing[32]
            },
            thead: {
              borderBottomColor: theme('colors.gray.200')
            },
            code: { color: theme('colors.pink.500') },
            /*pre: {
              color: 'var(--base05)',
              backgroundColor: 'var(--base00)',
              marginTop: 0,
              marginBottom: theme('spacing.8'),
              marginLeft: `-${theme('spacing.10vw')}`,
              marginRight: `-${theme('spacing.10vw')}`,
              padding: theme('spacing.8'),
              borderRadius: 0,

              [`@media (min-width: ${theme('screens.lg')})`]: {
                borderRadius: theme('borderRadius.lg'),
                ...breakout,
              },
            },
            '.embed': {
              position: 'relative',
              marginLeft: '-10vw',
              marginRight: '-10vw',
              [`@media (min-width: ${theme('screens.lg')})`]: {
                ...breakout,
              },
            },
            '.embed > div': {
              height: '0px',
            },
            '.embed > div > iframe': {
              height: '100% !important',
              width: '100% !important',
              top: '0',
              left: '0',
              position: 'absolute',
              border: 'none',
              borderRadius: '0 !important',
              [`@media (min-width: ${theme('screens.lg')})`]: {
                borderRadius: '0.5rem !important',
              },
            },*/
            'blockquote p:first-of-type::before': false,
            'blockquote p:last-of-type::after': false
          }
        },
        dark: {
          css: {
            color: theme('colors.gray.200'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.600')
              },
              code: { color: theme('colors.blue.400') }
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
              color: theme('colors.gray.300')
            },
            'h2,h3,h4': {
              color: theme('colors.gray.100'),
              'scroll-margin-top': spacing[32]
            },
            hr: { borderColor: theme('colors.gray.700') },
            ol: {
              li: {
                '&:before': { color: theme('colors.gray.500') }
              }
            },
            ul: {
              li: {
                '&:before': { backgroundColor: theme('colors.gray.500') }
              }
            },
            strong: { color: theme('colors.gray.100') },
            thead: {
              th: {
                color: theme('colors.gray.100')
              },
              borderBottomColor: theme('colors.gray.600')
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.gray.700')
              }
            }
          }
        }
      })
    }
  },
  variants: {
    typography: ['dark']
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp')
  ],
}