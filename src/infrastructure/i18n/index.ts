import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './locales/en';
import { vi } from './locales/vi';

const deviceLanguage =
  Localization.getLocales()[0]?.languageCode ?? 'vi';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',

    resources: {
      vi: {
        translation: vi,
      },
      en: {
        translation: en,
      },
    },

    lng: deviceLanguage === 'en' ? 'en' : 'vi',

    fallbackLng: 'vi',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;