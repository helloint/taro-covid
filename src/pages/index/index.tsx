import { useTranslation } from 'react-i18next';
import { View } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';

import './index.scss';

interface btnItem {
  id: string;
}

const BTN_LIST: btnItem[] = [
  {
    id: 'chart',
  },
  {
    id: 'map',
  },
  {
    id: 'address',
  },
  {
    id: 'data',
  },
];

export default function Index() {
  const goToComponent = (name: string): void => {
    navigateTo({
      url: `/pages/${name}/index`,
    });
  };

  const { t } = useTranslation();

  return (
    <View className='page index'>
      {BTN_LIST.map((item: btnItem, index: number) => {
        return (
          <View className={`btn-view view-${item.id}`} key={index} onClick={() => goToComponent(`${item.id}`)}>
            {t(`index.${item.id}`)}
          </View>
        );
      })}
    </View>
  );
}
