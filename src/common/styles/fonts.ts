import { Be_Vietnam_Pro, Outfit } from 'next/font/google'

const headingFont = Be_Vietnam_Pro({
  variable: '--heading-font',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin']
})

const bodyFont = Outfit({
  variable: '--body-font',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export { headingFont, bodyFont }
