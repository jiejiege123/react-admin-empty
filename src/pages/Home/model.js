/*
 * @Author: your name
 * @Date: 2020-08-17 10:36:34
 * @LastEditTime: 2020-09-01 14:34:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\react\demo\react-admin-empty\src\pages\Home\model.js
 */
import { fakeChartData } from './service';

const initState = {
  visitData: [],
  visitData2: [],
  salesData: [],
  searchData: [],
  offlineData: [],
  offlineChartData: [],
  salesTypeData: [],
  salesTypeDataOnline: [],
  salesTypeDataOffline: [],
  radarData: [],
};
const Model = {
  namespace: 'home',
  state: initState, // 数据
  effects: {
    // 数据操作和业务逻辑 类似于 vuex 的 action
    *fetch(_, { call, put }) {
      // 在组件.jsx 中 dispatch 方法: type: namespace/effects.属性, 可以带参数
      const response = yield call(fakeChartData); // yield 相当于async await call 调用接口
      yield put({
        // put 相当于dispatch
        type: 'save',
        payload: response,
      });
    },

    *fetchSalesData(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
  },
  reducers: {
    // 直接操作数据, 类似vuex的mutations
    save(state, { payload }) {
      return { ...state, ...payload };
    },

    clear() {
      return initState;
    },
  },
};
export default Model;
