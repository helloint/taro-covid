import { CovidDailyExt, CovidDailyTotalSource, CovidDailyTotalType, CovidRegion, CovidTableType } from './types';

/**
 * 扩展出可被计算的数据
 * 有些数据可以基于其他数据被计算出来，所以原始数据并没有提供，但前端需要使用。
 * @param data
 */
const extendData = (data: CovidDailyTotalSource): CovidDailyTotalType => {
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
    };
  });
  return {
    ...data,
    daily: dailyExt,
  };
};

/**
 * Cut the data which is after the endDate
 * @param data
 * @param endDate
 * @returns {{regions: {}, daily: {}}}
 */
const cutDailyData = (data: CovidDailyTotalType, endDate: string): CovidDailyTotalType => {
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

  return { total: data.total, daily, regions };
};

/**
 * 处理数据以供表格渲染用
 * date key 转换成可阅读的X月X日格式，同时提供一个最近X天的数据数组
 * @param data
 * @param dayLimit 保留最近X天的数据
 */
const processTableData = (data: CovidDailyTotalType, dayLimit: number): CovidTableType => {
  const daily: { [key: string]: CovidDailyExt } = {};
  const recentDaily: { [key: string]: CovidDailyExt } = {};
  const totalNum = Object.keys(data.daily).length;
  Object.entries(data.daily).forEach(([date, dailyData], index) => {
    const dateStr = parseInt(date.split('-')[1], 10) + '月' + parseInt(date.split('-')[2], 10) + '日';
    if (index >= totalNum - dayLimit) {
      recentDaily[dateStr] = dailyData;
    }
    daily[dateStr] = dailyData;
  });

  return { total: data.total, daily: daily, recentDaily: recentDaily };
};

/**
 * 仅筛选出指定字段的数据（数组）
 * @param origData
 * @param dataField
 */
const filterDailyData = (origData: { [key: string]: CovidDailyExt }, dataField: string): number | string[] => {
  const ret: number | string[] = [];
  Object.values(origData).forEach((dailyData) => {
    ret.push(dailyData[dataField]);
  });

  return ret;
};

/**
 * format date
 * @param date 2022-05-10
 * @param pattern yyyy年mm月dd日
 * @returns {string} 2022年5月10日
 */
const formatDate = (date: string, pattern: string): string => {
  return pattern
    .replace('yyyy', parseInt(date.split('-')[0], 10) + '')
    .replace('mm', parseInt(date.split('-')[1], 10) + '')
    .replace('dd', parseInt(date.split('-')[2], 10) + '');
};

export { extendData, cutDailyData, processTableData, filterDailyData, formatDate };
