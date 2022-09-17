import en from '../locales/en';
import vi from '../locales/vi';
import { createI18n } from 'vue-i18n';

const messages = {
  en,
  vi,
};

const datetimeFormats = {
  en: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }
  },
  vi: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
  globalInjection: true,
  datetimeFormats,
});

export default i18n;
