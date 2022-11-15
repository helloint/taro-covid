import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';
import Taro from '@tarojs/taro';
import './i18n';
import { Config, CONFIG_URL, httpClient } from './pages/utils';
import store from './store/store';

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
      <Suspense fallback={t('common.loading')}>{props.children}</Suspense>
    </Provider>
  );
};
export default App;
