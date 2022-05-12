import React,{useEffect,useState} from "react";
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { message,Modal,Skeleton} from 'antd';
import {updateUser,getUser} from '@/services/user';



const Edit= (props) =>{
    const [initialValues,setinitialValues] = useState(undefined);
    const {isModalVisible} = props;
    const {isShowModal} = props;
    const {actionRef} = props;
    const {editId} = props;
    
    //组件挂载
    useEffect(() => {
        async function fetchData(){
            
            if (editId !== undefined){
                //send request,get user info
                const response = await getUser(editId);
                setinitialValues({
                    name : response.name,
                    email : response.email,
                })
   
            }
        }
        fetchData();
    })
    
    

    //提交表单
    const editUser = async(values) =>{
          
        //send request add user
        const response = await updateUser(editId,values);
        if (response.status === undefined) {
            message.success('更新成功')
            actionRef.current.reload()
            isShowModal(false)
        }
           
    }

    return (
        <Modal 
        title="编辑用户" 
        visible={isModalVisible} 
        onCancel={() => isShowModal(false)}
        footer = {null}
        destroyOnClose = {true}
    >
        {
            initialValues === undefined ? <Skeleton active = {true} paragraph={{ rows: 4 }} />:
                <ProForm 
                    initialValues={initialValues}
                    onFinish={(values) => editUser(values)}
                    >
                        <ProFormText                    
                            name="name"
                            label="昵称"
                            placeholder="请输入昵称"
                            rules={[
                                {required:true,message:'请输入昵称'},
                            ]}
                        />
                        <ProFormText
                            name={'email'}
                            label="邮箱"
                            placeholder="请输入邮箱"
                            rules={[
                                {required:true,message:'请输入邮箱'},
                                {type:"email",message:'邮箱格式不正确'},
                            ]}
                        />
                       

                </ProForm>
        }
      </Modal>

    )
}
export default Edit;