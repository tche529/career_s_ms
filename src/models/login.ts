import { stringify } from 'querystring';
import type { Reducer, Effect } from 'umi';
import { history } from 'umi';

import { fakeAccountLogin, logout } from '@/services/login';

import { message } from 'antd';

export type StateType = {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
};

export type LoginModelType = {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
};

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    //send request,excuet login
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      if (response.status === undefined) {
        message.success('🎉 🎉 🎉  登录成功！');
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });

        //reedirect
        history.replace('/');
      }
    },

    *logout(_, { call }) {
      const load = message.loading('退出中....');

      const response = yield call(logout);
      if (response.status === undefined) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userInfo');
        message.success('Login out Success!');
        history.replace({
          pathname: '/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
        load();
      }

      // const { redirect } = getPageQuery();
      // // Note: There may be security issues, please note
      // if (window.location.pathname !== '/login' && !redirect) {
      //   history.replace({
      //     pathname: '/login',
      //     search: stringify({
      //       redirect: window.location.href,
      //     }),
      //   });
      // }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      //setAuthority(payload.access_token);
      //resorted token into localstorage

      localStorage.setItem('access_token', payload.access_token);
      return {
        ...state,
      };
    },
  },
};

export default Model;
