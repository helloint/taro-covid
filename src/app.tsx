import { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import Taro from '@tarojs/taro';
import store from './store/store';
import './i18n';

import './app.scss';

const App = (props) => {
  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init();
    }
  }, []);

  return (
    <Provider store={store}>
      <Suspense fallback='loading...'>{props.children}</Suspense>
    </Provider>
  );
};
export default App;
