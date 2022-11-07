import { useTranslation } from 'react-i18next';
import { View } from '@tarojs/components';

import './index.scss';

const Index = () => {
  const { t } = useTranslation();
  return <View className='page'>Map {t('common.coming_soon')}</View>;
};

export default Index;
