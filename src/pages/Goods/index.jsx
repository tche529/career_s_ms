import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Switch, message, Image } from 'antd';
import ProTable from '@ant-design/pro-table';

import { getClasses, isOn, isrecommend } from '@/services/class';
import ProForm from '@ant-design/pro-form';

import CreateorEdit from './components/CreateorEdit';

const Index = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  //const [isModalVisibleEdit,setModalVisibleEdit] = useState(false);
  const [editId, seteditId] = useState(undefined);
  //表格的ref，用于自定义操作表格
  const actionRef = useRef();

  //上架，下架, 推荐，不推荐
  const HandleisOnorRecommend = async (goodid, type = undefined) => {
    let response = {};
    if (type !== undefined) {
      response = await isOn(goodid);
    } else {
      response = await isrecommend(goodid);
    }
    if (response.status === undefined) message.success('操作成功');
  };
  //get classes list info

  const getDate = async (params) => {
    const response = await getClasses(params);
    return {
      data: response.data,
      success: true,
      total: response.meta.pagination.total,
    };
  };
  //控制新建模态框
  const isShowModal = (show, id = undefined) => {
    seteditId(id);
    setModalVisible(show);
  };

  const columns = [
    {
      title: '课程图',
      dataIndex: 'cover_url',
      hideInSearch: true,
      render: (_, record) => (
        <Image
          width={64}
          src={record.cover_url}
          placeholder={<Image preview={false} src={record.cover_url} width={200} />}
        />
      ),
    },
    {
      title: '课程名',
      dataIndex: 'title',
    },
    {
      title: '总价',
      dataIndex: 'price',
      hideInSearch: true,
    },
    {
      title: '人数',
      dataIndex: 'sales',
      hideInSearch: true,
    },
    {
      title: '是否上架',
      dataIndex: 'is_on',
      render: (_, record) => (
        <Switch
          checkedChildren="已上架"
          unCheckedChildren="未上架"
          defaultChecked={record.is_on === 1}
          onChange={() => HandleisOnorRecommend(record.id)}
        />
      ),
      valueType: 'radioButton',
      valueEnum: {
        1: { text: '已上架' },
        0: { text: '未上架' },
      },
    },
    {
      title: '是否推荐',
      dataIndex: 'is_recommend',
      render: (_, record) => (
        <Switch
          checkedChildren="已推荐"
          unCheckedChildren="未推荐"
          defaultChecked={record.is_recommend === 1}
          onChange={() => HandleisOnorRecommend(record.id, 'recommend')}
        />
      ),
      valueType: 'radioButton',
      valueEnum: {
        1: { text: '已推荐' },
        0: { text: '未推荐' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '操作',
      hideInSearch: true,
      render: (_, record) => <a onClick={() => isShowModal(true, record.id)}>编辑</a>,
    },
  ];

  return (
    <PageContainer>
      用户列表
      <ProTable
        columns={columns}
        actionRef={actionRef}
        request={async (params = {}) => getDate(params)}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        //   form={{
        //     // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        //     syncToUrl: (values, type) => {
        //       if (type === 'get') {
        //         return {
        //           ...values,
        //           created_at: [values.startTime, values.endTime],
        //         };
        //       }
        //       return values;
        //     },
        //   }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle="用户列表"
        //操作按钮
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => isShowModal(true)}
          >
            新建
          </Button>,
        ]}
      />
      {
        //判断模态框隐藏的时候不挂载组件，触发子组件的生命周期
        isModalVisible ? (
          <CreateorEdit
            isModalVisible={isModalVisible}
            isShowModal={isShowModal}
            actionRef={actionRef}
            editId={editId}
          />
        ) : (
          ''
        )
      }
    </PageContainer>
  );
};
export default Index;
