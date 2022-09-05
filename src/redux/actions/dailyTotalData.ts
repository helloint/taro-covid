import {request} from "@tarojs/taro";
import {GET_DAILY_TOTAL_DATA} from '../constants'
import {CovidDailyTotalSource, DAILY_TOTAL_URL} from "../../pages/utils";

export const getDailyTotalData = () => {
  return dispatch => {
    request({url: DAILY_TOTAL_URL})
      .then(res => res.data)
      .then(
        (dataSource: CovidDailyTotalSource) => {
          dispatch({
            type: GET_DAILY_TOTAL_DATA,
            payload: dataSource,
          });
        });
  };
}
