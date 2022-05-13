import type { Effect, Reducer } from 'umi';

import { queryCurrent, query as queryUsers } from '@/services/user';

export type CurrentUser = {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
};

export type UserModelState = {
  currentUser?: CurrentUser;
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
};

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      //console.log('user.ts' + response);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    //get current user info data
    *fetchCurrent(_, { call, put }) {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'));

      //console.log(isuserInfo);

      if (!userInfo) {
        userInfo = yield call(queryCurrent);
        if (userInfo.id !== undefined) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
      }

      //console.log(response);
      yield put({
        type: 'saveCurrentUser',
        payload: userInfo,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};

export default UserModel;
