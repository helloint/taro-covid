import {useEffect, useRef, useState} from 'react'
import Echarts, {EChartOption, EChartsInstance} from 'taro-react-echarts';
import {request} from "@tarojs/taro";
import {View} from '@tarojs/components';
import echarts from '../../assets/js/echarts.js';
import './chart.scss';
import {CovidDailyExt, CovidDailyTotalSource, CovidDailyTotalType, CovidRegion, CovidTableType} from "../utils/types";
import {DAILY_TOTAL_URL, DAY_LIMIT} from "../utils/constants";

export default function Index() {
  const charts = ['confirm', 'shaicha'];
  const chartRefs = [useRef<EChartsInstance>(null), useRef<EChartsInstance>(null)];
  // const [lastDate, setLastDate] = useState<string>('');
  const [currDate, setCurrDate] = useState<string>();
  const [origData, setOrigData] = useState<CovidDailyTotalType>();
  const basicOption: EChartOption = {
    title: {
      text: '...',
      padding: [5, 20],
      left: 'center',
      textStyle: {
        fontSize: 26,
      }
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      top: 15,
      left: 20,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: [],
      boundaryGap: true,
      axisLabel: {
        interval: 0,
        rotate: 40,
      }
    },
    yAxis: {
      type: 'value',
    },
    series: [],
  };
  const [chartReadyCount, setChartReadyCount] = useState<number>(0);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (origData && currDate && chartReadyCount === charts.length) {
      const recentData = cutDailyData(origData, currDate);
      // renderKanban(data);
      const chartData = processTableData(recentData, DAY_LIMIT);

      const confirmChartOption = basicOption && {
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
            },
            color: '#fdc368',
            smooth: true,
            animation: false,
            data: filterDailyData(chartData.recentDaily, 'wzz'),
          }
        ],
      };
      chartRefs[0].current.setOption(confirmChartOption);
      const shaichaChartOption = basicOption && {
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
            },
            color: '#fdc368',
            smooth: true,
            animation: false,
            data: filterDailyData(chartData.recentDaily, 'wzz_shaicha'),
          }
        ],
      };
      chartRefs[1].current.setOption(shaichaChartOption);
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

  return (
    <View className='page'>
      {charts.map((id, index) => {
        return <Echarts
          key={id}
          echarts={echarts}
          theme='dark'
          onChartReady={(echartsInstance: EChartsInstance) => {
            chartRefs[index].current = echartsInstance;
            setChartReadyCount(count => count + 1);
          }}
          opts={{devicePixelRatio: 2}}
          option={basicOption}
        ></Echarts>
      })}
    </View>
  )
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
      'confirm-wzz_percent': (dailyData.confirm / dailyData.wzz).toFixed(2) + '%',
      'wzz-zhuangui_percent': (dailyData.zhuangui / dailyData.wzz).toFixed(2) + '%',
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
    if (index > totalNum - dayLimit) {
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
