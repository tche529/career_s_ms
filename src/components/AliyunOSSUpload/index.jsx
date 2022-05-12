import React from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ossConfig } from '@/services/common';

export default class AliyunOSSUpload extends React.Component {
  state = {
    OSSData: {},
  };
  /**
   * 组件挂载完成，初始化获取oss
   */
  async componentDidMount() {
    await this.init();
  }
  //初始化，获取上传签名
  init = async () => {
    try {
      const OSSData = await ossConfig();
      //console.log(OSSData);

      this.setState({
        OSSData,
      });
    } catch (error) {
      message.error(error);
    }
  };

  /**
   * 文件上传过程中触发的回调函数
   * @param {*} param0
   */

  onChange = ({ file }) => {
    //console.log(file)
    if (file.status === 'done') {
      this.props.setCoverKey(file.key);
      message.success('上传成功');
    }
  };

  /**
   * 额外的上传参数
   * @param {*} file
   * @returns
   */

  getExtraData = (file) => {
    const { OSSData } = this.state;

    return {
      key: file.key,
      OSSAccessKeyId: OSSData.accessid,
      policy: OSSData.policy,
      Signature: OSSData.signature,
    };
  };

  /**
   * 选择文件之后，上传之前，执行回调
   * @param {*} file
   * @returns
   */
  beforeUpload = async (file) => {
    const { OSSData } = this.state;
    const expire = OSSData.expire * 1000;

    if (expire < Date.now()) {
      await this.init();
    }
    const dir = 'careerS/';

    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.key = OSSData.dir + dir + filename;
    file.url = OSSData.host + OSSData.dir + dir + filename;

    return file;
  };

  render() {
    const { value, accept } = this.props;
    const props = {
      accept: accept || '',
      name: 'file',
      fileList: value,
      action: this.state.OSSData.host,
      onChange: this.onChange,
      onRemove: this.onRemove,
      data: this.getExtraData,
      beforeUpload: this.beforeUpload,
      listType: 'picture',
      maxCount: 1,
    };
    return (
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>点击上传</Button>
      </Upload>
    );
  }
}
