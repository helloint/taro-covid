import { useEffect, useMemo, useState } from 'react';
import { EChartOption } from 'taro-react-echarts';
import { useTranslation } from 'react-i18next';
import { CovidDailyTotalType, cutDailyData, DAY_LIMIT, filterDailyData, processTableData } from '../utils';
import Chart from './chart';

interface Props {
  styleZoom: number;
  styleRatio: number;
  origData?: CovidDailyTotalType;
  currDate?: string;
}

const getOption: EChartOption = (styleZoom, styleRatio) => {
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

export default function Charts(props: Props) {
  const { styleZoom, styleRatio, origData, currDate } = props;

  const charts = useMemo(
    () => ['confirm', 'shaicha', 'cured', 'death', 'completeConfirmCured', 'completeShaicha', 'completeConfirmWzz'],
    []
  );
  const [chartOptions, setChartOptions] = useState<{ [key: string]: EChartOption }>({});
  // const [lastDate, setLastDate] = useState<string>('');
  // @ts-ignore
  const [chartReadyCount, setChartReadyCount] = useState<number>(0);
  const initOption = useMemo(() => getOption(styleZoom, styleRatio), [styleZoom, styleRatio]);
  const { t } = useTranslation();

  useEffect(() => {
    if (origData && currDate && chartReadyCount === charts.length) {
      const recentData = cutDailyData(origData, currDate);
      // renderKanban(data);
      const chartData = processTableData(recentData, DAY_LIMIT);

      const options: { [key: string]: EChartOption } = {};
      options['confirm'] = {
        title: {
          text: t('chart.confirm_title'),
        },
        xAxis: {
          data: Object.keys(chartData.recentDaily),
        },
        series: [
          {
            name: t('chart.confirm_serie_confirm'),
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
            name: t('chart.confirm_serie_wzz'),
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
      options['shaicha'] = {
        title: {
          text: t('chart.shaicha_title'),
        },
        xAxis: {
          data: Object.keys(chartData.recentDaily),
        },
        series: [
          {
            name: t('chart.shaicha_serie_confirm'),
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
            name: t('chart.shaicha_serie_wzz'),
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
      options['cured'] = {
        title: {
          text: t('chart.cured_title'),
        },
        xAxis: {
          data: Object.keys(chartData.recentDaily),
          axisLabel: {
            interval: 'auto',
          },
        },
        series: [
          {
            name: t('chart.cured_serie_curr_confirm'),
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
            name: t('chart.cured_serie_cured'),
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
      options['death'] = {
        title: {
          text: t('chart.death_title'),
        },
        xAxis: {
          data: Object.keys(chartData.recentDaily),
        },
        series: [
          {
            name: t('chart.death_serie_death'),
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
      options['completeConfirmCured'] = {
        title: {
          text: t('chart.completeConfirmCured_title'),
        },
        xAxis: {
          data: Object.keys(chartData.daily),
          axisLabel: {
            interval: 'auto',
          },
        },
        series: [
          {
            name: t('chart.completeConfirmCured_serie_confirm'),
            type: 'line',
            color: '#e47d7e',
            showSymbol: false,
            smooth: true,
            animation: false,
            data: filterDailyData(chartData.daily, 'confirm'),
          },
          {
            name: t('chart.completeConfirmCured_serie_cured'),
            type: 'line',
            color: '#6bdab4',
            showSymbol: false,
            smooth: true,
            animation: false,
            data: filterDailyData(chartData.daily, 'cured'),
          },
        ],
      };
      options['completeShaicha'] = {
        title: {
          text: t('chart.completeShaicha_title'),
        },
        xAxis: {
          data: Object.keys(chartData.daily),
          axisLabel: {
            interval: 'auto',
          },
        },
        series: [
          {
            name: t('chart.completeShaicha_serie_shaicha'),
            type: 'line',
            color: '#e58e51',
            animation: false,
            showSymbol: false,
            data: filterDailyData(chartData.daily, 'shaicha'),
          },
          {
            name: t('chart.completeShaicha_serie_total'),
            type: 'line',
            color: '#4f6fc7',
            animation: false,
            showSymbol: false,
            data: filterDailyData(chartData.daily, 'total'),
          },
        ],
      };
      options['completeConfirmWzz'] = {
        title: {
          text: t('chart.completeConfirmWzz_title'),
        },
        xAxis: {
          data: Object.keys(chartData.daily),
          axisLabel: {
            interval: 'auto',
          },
        },
        series: [
          {
            name: t('chart.completeConfirmWzz_serie_confirm'),
            type: 'line',
            color: '#e47d7e',
            animation: false,
            showSymbol: false,
            data: filterDailyData(chartData.daily, 'confirm'),
          },
          {
            name: t('chart.completeConfirmWzz_serie_wzz'),
            type: 'line',
            color: '#fdc368',
            animation: false,
            showSymbol: false,
            data: filterDailyData(chartData.daily, 'wzz'),
          },
        ],
      };
      setChartOptions(options);

      // 考虑把生成后的chart转换成image, 提高显示性能(参考: https://segmentfault.com/a/1190000040198947)
    }
  }, [origData, currDate, chartReadyCount, styleZoom, charts]);

  return (
    <>
      {charts.map((id) => {
        return (
          <Chart
            id={id}
            key={id}
            styleZoom={styleZoom}
            styleRatio={styleRatio}
            onReady={() => setChartReadyCount((count) => count + 1)}
            initOption={initOption}
            option={chartOptions[id]}
          ></Chart>
        );
      })}
    </>
  );
}
