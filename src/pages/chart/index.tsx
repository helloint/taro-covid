import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from '@tarojs/components';
import { useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import { getDailyTotal } from '../../store/dailyTotal/dailyTotalSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { formatDate, useWindowSize } from '../utils';
import Charts from './charts';
import Kanban from './kanban';
import Title from './title';

import './index.scss';

export default function Index() {
  const { t } = useTranslation();
  const city = t('chart.city');

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
        // TODO: 动态宽度，横屏支持
        setStyleZoom(390 / 750);
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

  const shareTitle = useMemo(() => {
    let ret = t('chart.name');
    if (currDate) {
      if (origData) {
        const daily = origData.daily[currDate];
        // pattern: 1+13 (1+3)
        const summary = `${daily.confirm}+${daily.wzz}(${daily.confirm_shaicha}+${daily.wzz_shaicha})`;
        ret = formatDate(currDate, t('common.short_date_pattern')) + city + summary;
      } else {
        ret = formatDate(currDate, t('common.short_date_pattern')) + city + ret;
      }
    }
    return ret;
  }, [city, currDate, origData, t]);

  useShareAppMessage((res) => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target);
    }
    return {
      title: shareTitle,
      path: '/pages/chart/index',
    };
  });

  useShareTimeline(() => {
    return {
      title: shareTitle,
    };
  });

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
