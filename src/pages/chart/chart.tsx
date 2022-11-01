import { useEffect, useRef, useState } from 'react';
import Echarts, { EChartOption, EChartsInstance } from 'taro-react-echarts';
import echarts from '../../assets/js/echarts';

interface Props {
  id: string;
  styleZoom: number;
  styleRatio: number;
  initOption: EChartOption;
  option: EChartOption;
  onReady: (id: string) => void;
}

export const Chart = (props: Props) => {
  const { id, styleZoom, styleRatio, initOption, option, onReady } = props;
  const ref = useRef<EChartsInstance>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady && option) {
      ref.current.setOption(option);
    }
  }, [isReady, option]);

  return (
    <Echarts
      isPage={false}
      key={id}
      className=''
      echarts={echarts}
      theme='dark'
      onChartReady={(echartsInstance: EChartsInstance) => {
        ref.current = echartsInstance;
        setIsReady(true);
        onReady(id);
      }}
      opts={{ devicePixelRatio: 2, width: 750 * styleZoom, height: 300 * styleZoom * styleRatio }}
      option={initOption}
      style={{
        width: 750 * styleZoom + 'px',
        height: 300 * styleZoom * styleRatio + 'px',
      }}
    ></Echarts>
  );
};

export default Chart;
