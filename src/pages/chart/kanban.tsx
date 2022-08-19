import React from 'react';
import {View} from "@tarojs/components";
import {CovidDailyExt} from "../utils/types";

import './kanban.scss';

interface Item {
  id: string,
  label: string,
  val?: string,
}

const items: Item[] = [
  {
    id: 'confirm',
    label: '本土确诊',
  }, {
    id: 'wzz',
    label: '本土无症状',
  }, {
    id: 'cured',
    label: '新增治愈',
  }, {
    id: 'death',
    label: '死亡病例',
  }, {
    id: 'total_confirm',
    label: '累计确诊',
  }, {
    id: 'total_wzz_correct',
    label: '累计无症状',
  }, {
    id: 'total_cured',
    label: '累计治愈',
  }, {
    id: 'total_death',
    label: '累计死亡',
  }];

const Kanban: React.FC<{ data?: CovidDailyExt }> = ({data}) => {
  if (data) {
    items.forEach(item => {
      item.val = data[item.id];
    });
  }

  return (
    <View id='kanban' className='kanban'>
      <View className='kanban__title'>看板</View>
      <View className='kanban__inner'>
        {items.map(({id, label, val}) => {
          const className = `kanban__item kanban__item--${id}`;
          return (
            <View key={id} className={className}>
              <View className='kanban__item-data'>{val || '...'}</View>
              <View className='kanban__item-label'>{label}</View>
            </View>
          )
        })}
      </View>
    </View>
  );
}

export default Kanban;
