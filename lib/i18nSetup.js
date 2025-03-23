import i18n from 'i18n'
import path from 'node:path'
import { __dirname } from '../lib/utils.js'

// register langs
i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: 'en',
  syncFiles: true,
  queryParameter: 'lang',
  cookie: 'nodepop-locale',
})

export default i18n