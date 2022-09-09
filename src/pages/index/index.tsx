import { Component } from 'react';
import { navigateTo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.scss';

interface btnItem {
  id: string;
  text: string;
}

const BTN_LIST: btnItem[] = [
  {
    id: 'chart',
    text: '图表',
  },
  {
    id: 'map',
    text: '地图',
  },
  {
    id: 'address',
    text: '地址',
  },
  {
    id: 'data',
    text: '数据',
  },
];

export default class Index extends Component {
  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  goToComponent = (name: string) => {
    navigateTo({
      url: `/pages/${name}/index`,
    });
  };

  render() {
    return (
      <View className='page index'>
        {BTN_LIST.map((item: btnItem, index: number) => {
          return (
            <View className={`btn-view view-${item.id}`} key={index} onClick={this.goToComponent.bind(this, `${item.id}`)}>
              {item.text}
            </View>
          );
        })}
      </View>
    );
  }
}
