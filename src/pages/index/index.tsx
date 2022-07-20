import { Component } from 'react'
import Taro from '@tarojs/taro';
import {View} from '@tarojs/components'
import './index.scss'

interface btnItem {
  id: string,
  text: string,
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
  },];

export default class Index extends Component {

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  goToComponent = (name: string) => {
    Taro.navigateTo({
      url: `/pages/${name}/${name}`
    });
  };

  render () {
    return (
      <View className='index'>
        {
          BTN_LIST.map((item: btnItem, index: number) => {
            return (
              <View className={`btn-view view-${item.id}`} key={index}
                onClick={this.goToComponent.bind(this, `${item.id}`)}
              >
                {item.text}
              </View>
            );
          })
        }
      </View>
    )
  }
}
