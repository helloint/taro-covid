import { Suspense } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import './i18n';

import './app.scss';

const App = (props) => {
  console.log(`cookie: ${document.cookie}`);
  return (
    <Provider store={store}>
      <Suspense fallback='loading...'>{props.children}</Suspense>
    </Provider>
  );
};
export default App;
