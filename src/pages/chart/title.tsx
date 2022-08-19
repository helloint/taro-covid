import React from 'react';
import {View} from "@tarojs/components";

import './title.scss';

const Title: React.FC<{ title?: string, location?: string | null }> = ({title = '...', location = '...'}) => {
  return (
    <View className='chart-title'>
      <View className='chart-title__left'></View>
      <View className='chart-title__center'>
        <View className='chart-title__date'>{title}</View>
        <View className='chart-title__location'>{location}</View>
      </View>
      <View className='chart-title__right'></View>
    </View>
  );
};

export default Title;
