/*
 * @Descripttion:
 * @version: 1.0
 * @Author:
 * @Date: 2021-10-08 15:46:24
 * @LastEditors: YingJie Xing
 * @LastEditTime: 2021-10-09 10:26:14
 */
export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/login',
        component: '../layouts/LoginLayout',
        routes: [
          {
            name: 'login',
            path: '/login',
            component: './Login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            //authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/dashboard',
              },
              {
                path: '/dashboard',
                name: 'dashboard',
                icon: '📊',
                component: '@/pages/DashBoard',
              },
              {
                path: '/user',
                name: 'user',
                icon: '👩🏽‍🎓',
                component: '@/pages/User',
              },
              {
                path: '/goods',
                name: 'goods',
                icon: '📚',
                component: '@/pages/Goods',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
];
