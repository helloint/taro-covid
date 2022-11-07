import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from '@tarojs/components';
import { CovidDailyExt } from '../utils';

import './kanban.scss';

interface Item {
  id: string;
  val?: string;
}

const items: Item[] = [
  {
    id: 'confirm',
  },
  {
    id: 'wzz',
  },
  {
    id: 'curr_confirm',
  },
  {
    id: 'death',
  },
  {
    id: 'confirm_shaicha',
  },
  {
    id: 'wzz_shaicha',
  },
  {
    id: 'total_confirm',
  },
  {
    id: 'total_cured',
  },
];

const Kanban: React.FC<{ data?: CovidDailyExt }> = ({ data }) => {
  if (data) {
    items.forEach((item) => {
      item.val = data[item.id];
    });
  }

  const { t } = useTranslation();

  return (
    <View id='kanban' className='kanban'>
      <View className='kanban__title'>{t('chart.kanban')}</View>
      <View className='kanban__inner'>
        {items.map(({ id, val }) => {
          const className = `kanban__item kanban__item--${id}`;
          return (
            <View key={id} className={className}>
              <View className='kanban__item-data'>{val ?? '...'}</View>
              <View className='kanban__item-label'>{t(`common.${id}`)}</View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Kanban;
