import React,{useEffect,useState} from "react";
import { Statistic, Card, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {fetchDashboard}from '@/services/dashboard';
const DashBoard = () => {

    //status changes
    let [data,setData] = useState({});
    useEffect(() => {
        //send request,get data
        async function fetchData(){
            const resData = await fetchDashboard();
            setData(resData);

        }
        fetchData();  
    },[]);

    return (
        
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="用户数"
                            value={data.users_count}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            //suffix="%"
                />
                    </Card>
            </Col>
            <Col span={8}>
                <Card>
                <Statistic
                    title="课程数"
                    value={data.goods_count}
                    precision={0}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<ArrowDownOutlined />}
                    //suffix="%"
                />
                </Card>
            </Col>
            <Col span={8}>
                    <Card>
                        <Statistic
                            title="订单数"
                            value={data.order_count}
                            precision={0}
                            valueStyle={{ color: '#234abc' }}
                            prefix={<ArrowUpOutlined />}
                            //suffix="%"
                />
                    </Card>
            </Col>
            </Row>

        </div>
    );
};
export default DashBoard;