import React from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import './index.less';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import { ContentUtils } from 'braft-utils';

export default class EditorDemo extends React.Component {
  state = {
    editorState: BraftEditor.createEditorState(this.props.content ?? null),
  };

  handleEditorChange = (editorState) => {
    this.setState({ editorState });

    if (!editorState.isEmpty()) {
      this.props.setdetailsKey(editorState.toHTML());
    } else {
      this.props.setdetailsKey('');
    }
  };

  insertImage = (url) => {
    this.setState({
      editorState: ContentUtils.insertMedias(this.state.editorState, [
        {
          type: 'IMAGE',
          url,
        },
      ]),
    });
  };

  render() {
    //上传组件-插入图片
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <AliyunOSSUpload accept="image/*" insertImage={this.insertImage} showUploadList={false}>
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              插入图片
            </button>
          </AliyunOSSUpload>
        ),
      },
    ];

    const { editorState } = this.state;

    return (
      <div className="my-editor">
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
          extendControls={extendControls}
        />
      </div>
    );
  }
}
