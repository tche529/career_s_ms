import React, { useEffect, useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { message, Modal, Skeleton } from 'antd';
import { updateUser, getUser, addUser } from '@/services/user';

const CreateorEdit = (props) => {
  //初始化表单值状态，在编辑时获取数据的状态
  const [initialValues, setinitialValues] = useState(undefined);
  const { isModalVisible } = props; //模态框是否显示
  const { isShowModal } = props; //模态框显示隐藏
  const { actionRef } = props; //刷新表格
  const { editId } = props; //要编辑的id

  const type = editId === undefined ? '添加' : '编辑';

  //组件挂载
  useEffect(() => {
    async function fetchData() {
      if (editId !== undefined) {
        //send request,get user info
        const response = await getUser(editId);
        setinitialValues({
          name: response.name,
          email: response.email,
        });
      }
    }
    fetchData();
  });

  //执行编辑或者添加

  const handleSubmit = async (values) => {
    let response = {};
    if (editId === undefined) {
      response = await addUser(values);
    } else {
      response = await updateUser(editId, values);
    }
    if (response.status === undefined) {
      message.success(`${type}成功`);
      actionRef.current.reload();
      isShowModal(false);
    }
  };

  return (
    <Modal
      title={`${type}用户`}
      visible={isModalVisible}
      onCancel={() => isShowModal(false)}
      footer={null}
      destroyOnClose={true}
    >
      {initialValues === undefined && editId !== undefined ? (
        <Skeleton active={true} paragraph={{ rows: 4 }} />
      ) : (
        <ProForm initialValues={initialValues} onFinish={(values) => handleSubmit(values)}>
          <ProFormText
            name="name"
            label="昵称"
            placeholder="请输入昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          />
          <ProFormText
            name={'email'}
            label="邮箱"
            placeholder="请输入邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          />
          {
            //只有添加有密码框
            editId !== undefined ? (
              ''
            ) : (
              <ProFormText.Password
                name={'password'}
                label="密码"
                placeholder="请输入密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码最少6位' },
                ]}
              />
            )
          }
        </ProForm>
      )}
    </Modal>
  );
};
export default CreateorEdit;
