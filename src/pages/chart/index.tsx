import { useEffect, useRef, useState } from 'react';
import { View } from '@tarojs/components';
import { useTranslation } from 'react-i18next';
import { getDailyTotal } from '../../store/dailyTotal/dailyTotalSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useWindowSize, formatDate } from '../utils';
import Charts from './charts';
import Title from './title';
import Kanban from './kanban';
import './index.scss';

export default function Index() {
  /*
  （1）容器初次初始化（2）容器resize
  触发容器配置重置，重置完后，触发容器变化事件（containerUpdatedCount）
  容器变化触发组件重新渲染
   */
  const ref = useRef<HTMLElement>(null);
  const [styleZoom, setStyleZoom] = useState(1);
  // control the height scale, the bigger, the taller. height = (width / 2.5) * styleRatio
  const styleRatio = 1;
  const [containerReady, setContainerReady] = useState(false);
  const containerResize = useWindowSize();
  const [containerUpdated, setContainerUpdated] = useState(0);
  const dispatch = useAppDispatch();

  // const [lastDate, setLastDate] = useState<string>('');
  // @ts-ignore
  const { currDate, dailyTotal: origData } = useAppSelector((state) => state.dailyTotal);

  useEffect(() => {
    setContainerReady(true);
    const promise = dispatch(getDailyTotal());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    if (containerReady) {
      // weapp内获取不到offsetWidth，需特殊处理
      if (process.env.TARO_ENV === 'weapp') {
        // FIXME：the below code doesn't work
        // const node = Taro.createSelectorQuery().select('#' + ref.current?.id);
        // node.boundingClientRect(rect => {
        //   console.log(`containerWidth: ${rect?.width}`);
        //   if (rect) {
        //     setStyleZoom(rect.width / 750);
        //     setContainerUpdated(count => count + 1);
        //   }
        // }).exec();
        setStyleZoom(390 / 750);
        // TODO: 动态宽度，横屏支持
        setContainerUpdated((count) => count + 1);
      } else {
        const containerWidth = ref.current?.offsetWidth;
        // console.log(`containerWidth: ${containerWidth}`);
        if (containerWidth) {
          setStyleZoom(containerWidth / 750);
          setContainerUpdated((count) => count + 1);
        }
      }
    }
  }, [containerReady, containerResize]);

  const { t } = useTranslation();
  const city = t('chart.city');

  return (
    <View ref={ref} className='page'>
      <View>
        <Title title={currDate && formatDate(currDate, t('common.date_pattern'))} location={city} />
        <Kanban data={currDate ? origData?.daily[currDate] : undefined} />
      </View>
      <View>
        {containerUpdated ? <Charts origData={origData} currDate={currDate} styleZoom={styleZoom} styleRatio={styleRatio} /> : ''}
      </View>
    </View>
  );
}
