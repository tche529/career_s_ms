import React, { useEffect, useState } from 'react';
import ProForm, {
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import { message, Modal, Skeleton, Upload, Cascader } from 'antd';
import { updateClass, getClass, addClass } from '@/services/class';
import { getCategory } from '@/services/category';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';

const CreateorEdit = (props) => {
  //初始化表单值状态，在编辑时获取数据的状态
  const [initialValues, setinitialValues] = useState(undefined);
  const [options, setOptions] = useState(undefined);
  //定义form实例，操作表单
  const [formObj] = ProForm.useForm();

  const { isModalVisible } = props; //模态框是否显示
  const { isShowModal } = props; //模态框显示隐藏
  const { actionRef } = props; //刷新表格
  const { editId } = props; //要编辑的id

  const type = editId === undefined ? '添加' : '编辑';

  //组件挂载
  useEffect(() => {
    async function fetchCategory() {
      const resCategory = await getCategory();
      if (resCategory !== undefined) setOptions(resCategory);
    }

    async function fetchData() {
      if (editId !== undefined) {
        //send request,get user info
        const response = await getClass(editId);
        setinitialValues({
          name: response.name,
          email: response.email,
        });
      }
    }
    fetchCategory();
    fetchData();
  });
  /**
   * 文件上传成功后 set cover字段
   * @param {*} fileKey
   * @returns
   */
  const setCoverKey = (fileKey) => formObj.setFieldsValue({ cover: fileKey });

  //执行编辑或者添加

  const handleSubmit = async (values) => {
    let response = {};
    if (editId === undefined) {
      response = await addClass(values);
    } else {
      response = await updateClass(editId, values);
    }
    if (response.status === undefined) {
      message.success(`${type}成功`);
      actionRef.current.reload();
      isShowModal(false);
    }
  };

  return (
    <Modal
      title={`${type}课程`}
      visible={isModalVisible}
      onCancel={() => isShowModal(false)}
      footer={null}
      destroyOnClose={true}
    >
      {initialValues === undefined && editId !== undefined ? (
        <Skeleton active={true} paragraph={{ rows: 4 }} />
      ) : (
        <ProForm
          form={formObj}
          initialValues={initialValues}
          onFinish={(values) => handleSubmit(values)}
        >
          <ProForm.Item
            name="category_id"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Cascader
              fieldNames={{
                label: 'name',
                value: 'id',
              }}
              options={options}
              placeholder="请选择分类"
            />
          </ProForm.Item>

          <ProFormText
            name={'title'}
            label="课程名"
            placeholder="请输入课程名"
            rules={[{ required: true, message: '请输入课程名' }]}
          />
          <ProFormTextArea
            name="description"
            label="描述"
            placeholder="请输入描述"
            rules={[{ required: true, message: '请输入描述' }]}
          />
          <ProFormDigit
            name="price"
            label="价格"
            placeholder="请输入价格"
            min={0}
            max={9999999999999}
            rules={[{ required: true, message: '请输入价格' }]}
          />
          <ProFormDigit
            name="stock"
            label="库存"
            placeholder="请输入库存"
            min={0}
            max={9999999999999}
            rules={[{ required: true, message: '请输入库存' }]}
          />

          <ProForm.Item
            label="请选择课程主图"
            name="cover"
            rules={[{ required: true, message: '请选择课程主图' }]}
          >
            <div>
              <AliyunOSSUpload accept="image/*" setCoverKey={setCoverKey} />
            </div>
          </ProForm.Item>

          <ProFormTextArea
            name="details"
            label="详情"
            placeholder="请输入详情"
            rules={[{ required: true, message: '请输入详情' }]}
          />
        </ProForm>
      )}
    </Modal>
  );
};
export default CreateorEdit;
