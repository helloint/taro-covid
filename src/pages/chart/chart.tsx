import { useEffect, useMemo, useRef, useState } from 'react';
import Echarts, { EChartOption, EChartsInstance } from 'taro-react-echarts';
import { View } from '@tarojs/components';
import { getDailyTotal } from '../../store/dailyTotal/dailyTotalSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import echarts from '../../assets/js/echarts.js';
import { DAY_LIMIT, useWindowSize, filterDailyData, formatDate, cutDailyData, processTableData } from '../utils';
import Kanban from './kanban';
import Title from './title';

import './chart.scss';

interface ChartRef {
  [chartId: string]: {
    ref: EChartsInstance;
    option: EChartOption | null;
  };
}

export default function Chart() {
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

  const charts = useMemo(
    () => ['confirm', 'shaicha', 'cured', 'death', 'completeConfirmCured', 'completeShaicha', 'completeConfirmWzz'],
    []
  );
  const chartRefs: ChartRef = {
    confirm: { ref: useRef<EChartsInstance>(null), option: null },
    shaicha: { ref: useRef<EChartsInstance>(null), option: null },
    cured: { ref: useRef<EChartsInstance>(null), option: null },
    death: { ref: useRef<EChartsInstance>(null), option: null },
    completeConfirmCured: { ref: useRef<EChartsInstance>(null), option: null },
    completeShaicha: { ref: useRef<EChartsInstance>(null), option: null },
    completeConfirmWzz: { ref: useRef<EChartsInstance>(null), option: null },
  };
  // const [lastDate, setLastDate] = useState<string>('');
  // @ts-ignore
  const { currDate, dailyTotal: origData } = useAppSelector((state) => state.dailyTotal);
  const [chartReadyCount, setChartReadyCount] = useState<number>(0);

  useEffect(() => {
    setContainerReady(true);
    const promise = dispatch(getDailyTotal());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  useEffect(() => {
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
  }, [containerReady, containerResize]);

  useEffect(() => {
    if (origData && currDate && chartReadyCount === charts.length) {
      const recentData = cutDailyData(origData, currDate);
      // renderKanban(data);
      const chartData = processTableData(recentData, DAY_LIMIT);

      chartRefs['confirm'].option = {
        title: {
          text: '确诊 & 无症状',
        },
        xAxis: {
          data: Object.keys(chartData.recentDaily),
        },
        series: [
          {
            name: '确诊',
            type: 'line',
            label: {
              show: true,
              position: 'inside',
              fontSize: 12 * styleZoom,
            },
            lineStyle: {
              width: 2 * styleZoom,
            },
            color: '#e47d7e',
            smooth: true,
            animation: false,
            data: filterDailyData(chartData.recentDaily, 'confirm'),
          },
          {
            name: '无症状',
            type: 'line',
            label: {
              show: true,
              fontSize: 12 * styleZoom,
            },
            lineStyle: {
              width: 2 * styleZoom,
            },
            color: '#fdc368',
            smooth: true,
            animation: false,
            data: filterDailyData(chartData.recentDaily, 'wzz'),
          },
        ],
      };
      chartRefs['shaicha'].option = {
        title: {
          text: '风险排查（社会面） 确诊 & 无症状',
        },
        xAxis: {
          data: Object.keys(chartData.recentDaily),
        },
        series: [
          {
            name: '确诊',
            type: 'line',
            label: {
              show: true,
              position: 'inside',
              fontSize: 12 * styleZoom,
            },
            lineStyle: {
              width: 2 * styleZoom,
            },
            color: '#e47d7e',
            smooth: true,
            animation: false,
            data: filterDailyData(chartData.recentDaily, 'confirm_shaicha'),
          },
          {
            name: '无症状',
            type: 'line',
            label: {
              show: true,
              fontSize: 12 * styleZoom,
            },
            lineStyle: {
              width: 2 * styleZoom,
            },
            color: '#fdc368',
            smooth: true,
            animation: false,
            data: filterDailyData(chartData.recentDaily, 'wzz_shaicha'),
          },
        ],
      };
      chartRefs['cured'].option = {
        title: {
          text: '在院治疗 & 新增治愈',
        },
        xAxis: {
          data: Object.keys(chartData.recentDaily),
          axisLabel: {
            interval: 'auto',
          },
        },
        series: [
          {
            name: '在院治疗',
            type: 'bar',
            label: {
              show: true,
              position: 'top',
            },
            color: '#e47d7e',
            animation: false,
            data: filterDailyData(chartData.recentDaily, 'curr_confirm'),
          },
          {
            name: '新增治愈',
            type: 'bar',
            label: {
              show: true,
              position: 'top',
            },
            color: '#6bdab4',
            animation: false,
            data: filterDailyData(chartData.recentDaily, 'cured'),
          },
        ],
      };
      chartRefs['death'].option = {
        title: {
          text: '死亡病例',
        },
        xAxis: {
          data: Object.keys(chartData.recentDaily),
        },
        series: [
          {
            name: '死亡病例',
            type: 'bar',
            label: {
              show: true,
              position: 'top',
            },
            color: '#4e5a65',
            animation: false,
            data: filterDailyData(chartData.recentDaily, 'death'),
          },
        ],
      };
      chartRefs['completeConfirmCured'].option = {
        title: {
          text: '本轮疫情：确诊 & 治愈',
        },
        xAxis: {
          data: Object.keys(chartData.daily),
          axisLabel: {
            interval: 'auto',
          },
        },
        series: [
          {
            name: '确诊',
            type: 'line',
            color: '#e47d7e',
            showSymbol: false,
            smooth: true,
            animation: false,
            data: filterDailyData(chartData.daily, 'confirm'),
          },
          {
            name: '治愈',
            type: 'line',
            color: '#6bdab4',
            showSymbol: false,
            smooth: true,
            animation: false,
            data: filterDailyData(chartData.daily, 'cured'),
          },
        ],
      };
      chartRefs['completeShaicha'].option = {
        title: {
          text: '本轮疫情：风险排查 & 阳性总数',
        },
        xAxis: {
          data: Object.keys(chartData.daily),
          axisLabel: {
            interval: 'auto',
          },
        },
        series: [
          {
            name: '风险排查',
            type: 'line',
            color: '#e58e51',
            animation: false,
            showSymbol: false,
            data: filterDailyData(chartData.daily, 'shaicha'),
          },
          {
            name: '阳性总数',
            type: 'line',
            color: '#4f6fc7',
            animation: false,
            showSymbol: false,
            data: filterDailyData(chartData.daily, 'total'),
          },
        ],
      };
      chartRefs['completeConfirmWzz'].option = {
        title: {
          text: '本轮疫情：确诊 & 无症状',
        },
        xAxis: {
          data: Object.keys(chartData.daily),
          axisLabel: {
            interval: 'auto',
          },
        },
        series: [
          {
            name: '确诊',
            type: 'line',
            color: '#e47d7e',
            animation: false,
            showSymbol: false,
            data: filterDailyData(chartData.daily, 'confirm'),
          },
          {
            name: '无症状',
            type: 'line',
            color: '#fdc368',
            animation: false,
            showSymbol: false,
            data: filterDailyData(chartData.daily, 'wzz'),
          },
        ],
      };

      Object.values(chartRefs).forEach((item) => {
        item.ref.current.setOption(item.option);
      });
      // 考虑把生成后的chart转换成image, 提高显示性能(参考: https://segmentfault.com/a/1190000040198947)
    }
  }, [origData, currDate, chartReadyCount, styleZoom, charts]);

  const getOption: EChartOption = () => {
    return {
      title: {
        text: '...',
        padding: [10 * styleZoom * styleRatio, 20 * styleZoom, 5 * styleZoom * styleRatio],
        left: 'center',
        textStyle: {
          fontSize: 26 * styleZoom,
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        top: 15 * styleZoom * styleRatio,
        left: 20 * styleZoom,
        padding: [5 * styleZoom * styleRatio, 5 * styleZoom],
        itemGap: 10 * styleZoom,
        itemWidth: 25 * styleZoom,
        itemHeight: 14 * styleZoom,
        textStyle: {
          fontSize: 12 * styleZoom,
        },
        lineStyle: {
          width: 2 * styleZoom,
        },
      },
      grid: {
        left: 3 * styleZoom + '%',
        right: 4 * styleZoom + '%',
        bottom: 3 * styleZoom * styleRatio + '%',
        height: 230 * styleZoom * styleRatio,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: [],
        boundaryGap: true,
        axisLabel: {
          interval: 0, // 控制x轴间距。默认会根据空间动态调整显示数量，设置为0表示强制全部显示。
          rotate: 40,
          fontSize: 12 * styleZoom,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 12 * styleZoom,
        },
      },
    };
  };

  return (
    <View ref={ref} className='page'>
      <View>
        <Title title={currDate && formatDate(currDate)} location='上海' />
        <Kanban data={currDate ? origData?.daily[currDate] : undefined} />
      </View>
      <View>
        {containerUpdated
          ? charts.map((id) => {
              return (
                <Echarts
                  key={id}
                  className=''
                  echarts={echarts}
                  theme='dark'
                  onChartReady={(echartsInstance: EChartsInstance) => {
                    chartRefs[id].ref.current = echartsInstance;
                    setChartReadyCount((count) => count + 1);
                  }}
                  opts={{ devicePixelRatio: 2, width: 750 * styleZoom, height: 300 * styleZoom * styleRatio }}
                  option={getOption()}
                  style={{
                    width: 750 * styleZoom + 'px',
                    height: 300 * styleZoom * styleRatio + 'px',
                  }}
                ></Echarts>
              );
            })
          : ''}
      </View>
    </View>
  );
}
