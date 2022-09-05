import {GET_DAILY_TOTAL_DATA} from '../constants'
import {extendData} from "../../pages/utils";

interface stateType {
  dailyTotal?: ReturnType<typeof extendData>;
  currDate?: string,
}

const INITIAL_STATE: stateType = {};

const dailyTotalData = (state = INITIAL_STATE, action): stateType => {
  switch (action.type) {
    case GET_DAILY_TOTAL_DATA:
      const extendedData = extendData(action.payload);
      const date = Object.keys(extendedData.daily)[Object.keys(extendedData.daily).length - 1];
      return {
        ...state,
        dailyTotal: extendedData,
        currDate: date,
      };
    default:
      return state;
  }
}

export default dailyTotalData;
