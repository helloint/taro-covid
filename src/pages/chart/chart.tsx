import {useEffect, useRef, useState} from 'react'
import Echarts, {EChartOption, EChartsInstance} from 'taro-react-echarts';
import {request} from "@tarojs/taro";
import {View} from '@tarojs/components';
import echarts from '../../assets/js/echarts.js';
import {CovidDailyExt, CovidDailyTotalSource, CovidDailyTotalType, CovidRegion, CovidTableType} from "../utils/types";
import {DAILY_TOTAL_URL, DAY_LIMIT} from "../utils/constants";
import Kanban from "./kanban";
import Title from "./title";

import './chart.scss';

interface ChartRef {
  [chartId: string]: {
    ref: EChartsInstance,
    option: EChartOption | null,
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

  const charts = ['confirm', 'shaicha', 'cured', 'death', 'completeConfirmCured', 'completeShaicha', 'completeConfirmWzz'];
  const chartRefs: ChartRef = {
    confirm: {ref: useRef<EChartsInstance>(null), option: null},
    shaicha: {ref: useRef<EChartsInstance>(null), option: null},
    cured: {ref: useRef<EChartsInstance>(null), option: null},
    death: {ref: useRef<EChartsInstance>(null), option: null},
    completeConfirmCured: {ref: useRef<EChartsInstance>(null), option: null},
    completeShaicha: {ref: useRef<EChartsInstance>(null), option: null},
    completeConfirmWzz: {ref: useRef<EChartsInstance>(null), option: null},
  }
  // const [lastDate, setLastDate] = useState<string>('');
  const [currDate, setCurrDate] = useState<string>();
  const [origData, setOrigData] = useState<CovidDailyTotalType>();
  const [chartReadyCount, setChartReadyCount] = useState<number>(0);

  useEffect(() => {
    setContainerReady(true);

    getData();
  }, []);

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
      setContainerUpdated(count => count + 1);
    } else {
      const containerWidth = ref.current?.offsetWidth;
      // console.log(`containerWidth: ${containerWidth}`);
      if (containerWidth) {
        setStyleZoom(containerWidth / 750);
        setContainerUpdated(count => count + 1);
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
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
          }
        ],
      };

      Object.values(chartRefs).forEach((item) => {
        item.ref.current.setOption(item.option);
      });
    }
  }, [origData, currDate, chartReadyCount]);

  const getData = () => {
    request({url: DAILY_TOTAL_URL})
      .then(res => res.data)
      .then(
        (dataSource: CovidDailyTotalSource) => {
          const extendedData = extendData(dataSource);
          const date = Object.keys(extendedData.daily)[Object.keys(extendedData.daily).length - 1];
          // setLastDate(date); // 目前没用到
          setOrigData(extendedData);
          setCurrDate(date);
        });
  }

  const getOption: EChartOption = () => {
    return {
      title: {
        text: '...',
        padding: [10 * styleZoom * styleRatio, 20 * styleZoom, 5 * styleZoom * styleRatio],
        left: 'center',
        textStyle: {
          fontSize: 26 * styleZoom,
        }
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
          interval: 0,  // 控制x轴间距。默认会根据空间动态调整显示数量，设置为0表示强制全部显示。
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
  }

  return (
    <View ref={ref} className='page'>
      <View>
        <Title title={currDate && formatDate(currDate)} location='上海'/>
        <Kanban data={currDate ? origData?.daily[currDate] : undefined}/>
      </View>
      <View>
        {containerUpdated ? charts.map(id => {
          return <Echarts
            key={id}
            className=''
            echarts={echarts}
            theme='dark'
            onChartReady={(echartsInstance: EChartsInstance) => {
              chartRefs[id].ref.current = echartsInstance;
              setChartReadyCount(count => count + 1);
            }}
            opts={{devicePixelRatio: 2, width: 750 * styleZoom, height: 300 * styleZoom * styleRatio}}
            option={getOption()}
            style={{
              width: 750 * styleZoom + 'px',
              height: 300 * styleZoom * styleRatio + 'px',
            }}
          ></Echarts>
        }) : ''}
      </View>
    </View>
  )
}

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

/**
 * 扩展出可被计算的数据
 * 有些数据可以基于其他数据被计算出来，所以原始数据并没有提供，但前端需要使用。
 * @param data
 */
function extendData(data: CovidDailyTotalSource): CovidDailyTotalType {
  let total_cured = 0,
    total_confirm = 0,
    total_wzz = 0,
    total_zhuangui = 0,
    total_death = 0;

  const dailyExt: { [key: string]: CovidDailyExt } = {};

  Object.entries(data.daily).forEach(([date, dailyData]) => {
    total_cured += dailyData.cured;
    total_confirm += dailyData.confirm;
    total_wzz += dailyData.wzz;
    total_zhuangui += dailyData.zhuangui;
    total_death += dailyData.death;

    dailyExt[date] = {
      ...dailyData,
      total_confirm: total_confirm,
      total_wzz: total_wzz,
      total_wzz_correct: total_wzz - total_zhuangui,
      total_zhuangui: total_zhuangui,
      total_death: total_death,
      history_total_cured: total_cured + 385,
      'confirm-wzz_percent': (dailyData.wzz != 0 ? (dailyData.confirm / dailyData.wzz).toFixed(2) : 0) + '%',
      'wzz-zhuangui_percent': (dailyData.wzz != 0 ? (dailyData.zhuangui / dailyData.wzz).toFixed(2) : 0) + '%',
    }
  });
  return {
    ...data,
    daily: dailyExt,
  };
}

/**
 * Cut the data which is after the endDate
 * @param data
 * @param endDate
 * @returns {{regions: {}, daily: {}}}
 */
function cutDailyData(data: CovidDailyTotalType, endDate: string): CovidDailyTotalType {
  const daily: { [key: string]: CovidDailyExt } = {};
  Object.entries(data.daily).forEach(([date, item]) => {
    if (date <= endDate) {
      daily[date] = item;
    }
  });

  const regions: { [key: string]: CovidRegion } = {};
  Object.entries(data.regions).forEach(([date, item]) => {
    if (date <= endDate) {
      regions[date] = item;
    }
  });

  return {total: data.total, daily, regions};
}

/**
 * 处理数据以供表格渲染用
 * date key 转换成可阅读的X月X日格式，同时提供一个最近X天的数据数组
 * @param data
 * @param dayLimit 保留最近X天的数据
 */
function processTableData(data: CovidDailyTotalType, dayLimit: number): CovidTableType {
  const daily: { [key: string]: CovidDailyExt } = {};
  const recentDaily: { [key: string]: CovidDailyExt } = {};
  const totalNum = Object.keys(data.daily).length;
  Object.entries(data.daily).forEach(([date, dailyData], index) => {
    const dateStr = parseInt(date.split('-')[1], 10) + '月'
      + parseInt(date.split('-')[2], 10) + '日';
    if (index >= totalNum - dayLimit) {
      recentDaily[dateStr] = dailyData;
    }
    daily[dateStr] = dailyData;
  });

  return {total: data.total, daily: daily, recentDaily: recentDaily};
}

/**
 * 仅筛选出指定字段的数据（数组）
 * @param origData
 * @param dataField
 */
function filterDailyData(origData: { [key: string]: CovidDailyExt }, dataField: string): number | string[] {
  const ret: number | string[] = [];
  Object.values(origData).forEach((dailyData) => {
    ret.push(dailyData[dataField]);
  });

  return ret;
}

/**
 * format date
 * @param date 2022-05-10
 * @returns {string} 2022年5月10日
 */
const formatDate = (date: string): string => {
  return parseInt(date.split('-')[0], 10) + '年' + parseInt(date.split('-')[1], 10) + '月' + parseInt(date.split('-')[2], 10) + '日';
}
