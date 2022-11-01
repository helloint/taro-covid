import { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import Taro from '@tarojs/taro';
import { useTranslation } from 'react-i18next';
import store from './store/store';
import { Config, CONFIG_URL, httpClient } from './pages/utils';
import './i18n';

import './app.scss';

const App = (props) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init();
    }

    httpClient(CONFIG_URL).then((data: Config) => {
      i18n.changeLanguage(data.locale);
    });
  }, []);

  return (
    <Provider store={store}>
      <Suspense fallback={t('loading')}>{props.children}</Suspense>
    </Provider>
  );
};
export default App;
