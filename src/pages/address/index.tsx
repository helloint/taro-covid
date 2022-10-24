import { View } from '@tarojs/components';
import { useTranslation } from 'react-i18next';
import './index.scss';

const Index = () => {
  const { t } = useTranslation();
  return <View className='page'>Address {t('common.coming_soon')}</View>;
};

export default Index;
