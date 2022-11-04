import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from '@tarojs/components';
import { useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import Table, { Columns } from 'taro-react-table';
import 'taro-react-table/dist/index.css';
import { getDailyTotal } from '../../store/dailyTotal/dailyTotalSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import './index.scss';

const Index = () => {
  useShareAppMessage((res) => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target);
    }
    return {
      title: t('data.name'),
      path: '/pages/chart/index',
    };
  });

  useShareTimeline(() => {
    return {
      title: t('data.name'),
    };
  });

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState<{ [key: string]: number | string }[]>([]);
  const { dailyTotal } = useAppSelector((state) => state.dailyTotal);

  const dataColumns = [
    'date',
    'confirm',
    'wzz',
    'zhuangui',
    'confirm_bihuan',
    'wzz_bihuan',
    'confirm_shaicha',
    'wzz_shaicha',
    'curr_confirm',
    'curr_heavy',
    'curr_cri',
    'cured',
    'total_cured',
    'death',
    'bihuan',
    'shaicha',
    'confirm-wzz_percent',
    'wzz-zhuangui_percent',
    'total_confirm',
    'total_wzz',
    'total_zhuangui',
    'total_wzz_correct',
    'total',
    'total_death',
    'history_total_cured',
  ];

  const columns: Columns[] = dataColumns.map((col) => {
    return {
      title: t('data.' + col),
      dataIndex: col,
      fixed: col == 'date' ? 'left' : undefined,
    };
  });

  useEffect(() => {
    const promise = dispatch(getDailyTotal());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    if (dailyTotal) {
      const ds: { [key: string]: number | string }[] = [];
      for (const [date, covid] of Object.entries(dailyTotal.daily)) {
        const row = Object.assign({}, covid);
        row['date'] = date;
        ds.push(row);
      }
      setDataSource(ds.reverse());
    }
  }, [dailyTotal]);

  return (
    <View>
      {dataSource ? (
        <Table
          scrollX
          columns={columns}
          dataSource={dataSource}
          rowKey='date'
          colWidth={50}
          wrapperClass={process.env.TARO_ENV != 'h5' ? 'page' : ''}
        ></Table>
      ) : (
        ''
      )}
    </View>
  );
};

export default Index;
