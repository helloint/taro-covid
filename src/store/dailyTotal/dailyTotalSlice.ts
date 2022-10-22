import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DAILY_TOTAL_URL, extendData, httpClient } from '../../pages/utils';

interface stateType {
  dailyTotal?: ReturnType<typeof extendData>;
  currDate?: string;
  loading: boolean;
  error?: any;
}

const initialState: stateType = {
  loading: false,
};

const getDailyTotal = createAsyncThunk('dailyTotal/get', async () => {
  return await httpClient(DAILY_TOTAL_URL);
});

const dailyTotalSlice = createSlice({
  name: 'dailyTotal',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDailyTotal.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDailyTotal.fulfilled, (state, action) => {
        state.loading = false;
        const extendedData = extendData(action.payload);
        const date = Object.keys(extendedData.daily)[Object.keys(extendedData.daily).length - 1];
        state.dailyTotal = extendedData;
        state.currDate = date;
      })
      .addCase(getDailyTotal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export { getDailyTotal };
export default dailyTotalSlice.reducer;
