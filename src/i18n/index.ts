import * as i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from '../assets/locales/en.json';
import zh from '../assets/locales/zh.json';
import zhWx from '../assets/locales/zhWx.json';

if (document.cookie !== undefined) {
  // FIXME: 微信小程序会报错，原因分析是因为在小程序里，document.cookie返回undefined，导致组件执行document.cookie.split报错了
  i18n.use(LanguageDetector); //嗅探当前浏览器语言
}

i18n
  .use(Backend)
  .use(initReactI18next) //init i18next
  .init({
    resources: {
      en: {
        translation: en,
      },
      zh: {
        translation: zh,
      },
      zhWx: {
        translation: zhWx,
      },
    },
    //引入资源文件
    // backend: {
    //   loadPath: 'http://localhost:8080/static/locales/{{lng}}.json',
    // },
    fallbackLng: 'zhWx',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
