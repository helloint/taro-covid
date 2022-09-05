import {Provider} from 'react-redux';
import store from './redux/store';

import './app.scss'

const App = (props) => {
  return (
    <Provider store={store()}>
      {props.children}
    </Provider>
  );
}
export default App;
