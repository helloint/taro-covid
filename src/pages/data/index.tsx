import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import Table, { Columns } from 'taro-react-table';
import { getDailyTotal } from '../../store/dailyTotal/dailyTotalSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import 'taro-react-table/dist/index.css';
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
  const [loading, setLoading] = useState(true);

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
      width: col == 'date' ? 40 : t('data.' + col).length * 8 + 10,
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
      // Have to use 'any' here instead of the expected 'string | number' to resolve the TypeScript issue
      // See https://stackoverflow.com/questions/37006008/typescript-index-signature-is-missing-in-type
      const ds: { [key: string]: any }[] = [];
      for (const [date, covid] of Object.entries(dailyTotal.daily)) {
        const row = Object.assign({}, covid);
        row['date'] = date;
        ds.push(row);
      }
      setDataSource(ds.reverse());
      setLoading(false);
    }
  }, [dailyTotal]);

  return (
    <Table
      scrollX
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey='date'
      colWidth={40}
      size={0}
      striped
      wrapperClass={process.env.TARO_ENV != 'h5' ? 'page' : ''}
    ></Table>
  );
};

export default Index;
