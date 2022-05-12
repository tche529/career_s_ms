import { PageContainer } from "@ant-design/pro-layout";
import React,{useRef,useState} from "react";
import { PlusOutlined,UserOutlined} from '@ant-design/icons';
import { Button,Avatar,Switch,message } from 'antd';
import ProTable from '@ant-design/pro-table';

import {getUsers,lockerUser} from '@/services/user';
import ProForm from '@ant-design/pro-form';
import Create from "./components/Create";
import Edit from "./components/Edit";
import CreateorEdit from "./components/CreateorEdit";

const Index = () =>{
    const [isModalVisible,setModalVisible] = useState(false);
    //const [isModalVisibleEdit,setModalVisibleEdit] = useState(false);
    const [editId,seteditId] = useState(undefined);
    //表格的ref，用于自定义操作表格
    const actionRef = useRef();

    const lockUser_c = async(uid) =>{
        const response = await lockerUser(record.id)
        if (response.status === undefined) message.success('操作成功')
        
    }
        //get user list info

    const getDate = async (params) => {
            const response = await getUsers(params)
            return {
                data:response.data,
                success:true,
                total:response.meta.pagination.total,
            };
    }
    //控制新建模态框
    const isShowModal = (show,id=undefined) =>{
        seteditId(id)
        setModalVisible(show)
    }

    //控制编辑模态框
    // const isShowModalEdit = (show,id) =>{
    //     seteditId(id)
    //     setModalVisibleEdit(show)      
    // }



    const columns = [
        {
            title:'头像',
            dataIndex: 'avatar_url',
            hideInSearch:true,
            render: (_,record) => <Avatar src = {record.avatar_ur} size={32} icon={<UserOutlined />} />
        },
        {
            title:'姓名',
            dataIndex: 'name',
        },
        {
            title:'邮箱',
            dataIndex: 'email',
        },
        {
            title:'手机号',
            dataIndex: 'phonenumber',
            hideInSearch:true,
        },
        {
            title:'是否禁用',
            dataIndex: 'is_locked',
            hideInSearch:true,
            // render: (_,record) => <Switch 
            //             checkedChildren="启用" 
            //             unCheckedChildren="禁用" 
            //             defaultCheced = {record.is_locked === 0}
            //             onChange={ () => lockUser_c(record.id) } 
            //         />
        },
        {
            title:'创建时间',
            dataIndex: 'created_at',
            hideInSearch:true,
        },
        {
            title:'操作',
            hideInSearch:true,
            render: (_,record) => <a onClick={() =>isShowModal(true,record.id)}>编辑</a>
                        
        },
    ]




    return (
        <PageContainer>
            用户列表
            <ProTable
                columns={columns}
                actionRef={actionRef}
               
                request={async (params = {}) => getUsers(params)}
      
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
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => isShowModal(true)}>
          新建
        </Button>,
        
      ]}
    />

    {
        //判断模态框隐藏的时候不挂载组件，触发子组件的生命周期
        isModalVisible ?
        <CreateorEdit 
        isModalVisible = {isModalVisible} 
        isShowModal = {isShowModal}
        actionRef = {actionRef}
        editId = {editId}
        />
        : ''
    }

    
    
    </PageContainer>
        

    )
}
export default Index;