import React, { useEffect, useState } from 'react';
import ProForm, {
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import { message, Modal, Skeleton, Upload, Cascader, Button, Image } from 'antd';
import { updateClass, getClass, addClass } from '@/services/class';
import { UploadOutlined } from '@ant-design/icons';
import { getCategory } from '@/services/category';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import Editor from '@/components/Editor';

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
    async function fetchData() {
      const resCategory = await getCategory();
      if (resCategory !== undefined) setOptions(resCategory);
      if (editId !== undefined) {
        //send request,get user info
        const response = await getClass(editId);
        //console.log(response);
        const { pid, id } = response.category;
        const defaultcategory = pid === 0 ? [id] : [pid, id];
        setinitialValues({
          ...response,
          category_id: defaultcategory,
        });
      }
    }

    fetchData();
  }, []);

  /**
   * 文件上传成功后 set cover字段
   * @param {*} fileKey
   * @returns
   */
  const setCoverKey = (fileKey) => formObj.setFieldsValue({ cover: fileKey });

  /**
   * 文件上传成功后 set cover字段
   * @param {*} fileKey
   * @returns
   */
  const setdetailsKey = (content) => {
    formObj.setFieldsValue({ details: content });
  };

  //执行编辑或者添加

  const handleSubmit = async (values) => {
    //console.log(values);
    let response = {};
    if (editId === undefined) {
      response = await addClass({ ...values, category_id: values.category_id[1] });
    } else {
      response = await updateClass(editId, { ...values, category_id: values.category_id[1] });
      //console.log(response);
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

          <ProFormText name="cover" hidden={true} />

          <ProForm.Item
            label="请选择课程主图"
            name="cover"
            rules={[{ required: true, message: '请选择课程主图' }]}
          >
            <div>
              <AliyunOSSUpload accept="image/*" setCoverKey={setCoverKey} showUploadList={true}>
                <Button icon={<UploadOutlined />}>点击上传</Button>
              </AliyunOSSUpload>
              {initialValues === undefined || !initialValues.cover_url ? (
                ''
              ) : (
                <Image width={200} src={initialValues.cover_url} />
              )}
            </div>
          </ProForm.Item>

          <ProForm.Item
            name="details"
            label="详情"
            placeholder="请输入详情"
            rules={[{ required: true, message: '请输入详情' }]}
          >
            <Editor
              setdetailsKey={setdetailsKey}
              content={initialValues === undefined ? '' : initialValues.details}
            />
          </ProForm.Item>
        </ProForm>
      )}
    </Modal>
  );
};
export default CreateorEdit;
