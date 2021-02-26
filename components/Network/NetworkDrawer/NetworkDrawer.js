import {Typography, Button, Card, Col, Divider, Drawer, Form, Input, InputNumber, Row, Select, Slider, Switch} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {useState} from "react";

const { Title } = Typography;

const NetworkDrawer = ({ onClose, visible, handleSubmit }) => {
    const [ ordererCount, setOrdererCount ] = useState(1);
    const [ orgCount, setOrgCount ] = useState(2);

    return (
        <Drawer
            title="新增网络"
            width={540}
            placement="right"
            closable
            onClose={onClose}
            visible={visible}
            getContainer={'#content-holder'}
            style={{ position: 'absolute' }}
            footer={
                <div style={{textAlign: 'right'}}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button onClick={handleSubmit} type="primary">Submit</Button>
                </div>
            }
        >
            <Form layout={'vertical'}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label={'网络名称'} rules={{ require: true, message: '请输入自定义网络名称' }}>
                            <Input placeholder='请输入自定义网络名称' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'共识协议'} rules={{ require: true, message: '请选择共识协议' }}>
                            <Select placeholder='请选择共识协议'>
                                <Select.Option value="solo">solo</Select.Option>
                                <Select.Option value="etcdRaft">etcdRaft</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label={'开启TLS'} >
                    <Switch
                        defaultChecked
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                    />
                </Form.Item>
            </Form>


            <Divider orientation={'left'}>排序节点配置</Divider>
            <Form layout={'vertical'}>
                <Form.Item label={'节点个数'}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <InputNumber min={1} max={20} onChange={setOrdererCount} value={ordererCount} />
                        </Col>
                        <Col span={18}>
                            <Slider min={1} max={20} onChange={{}} />
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item label={'节点名称配置'}>
                    <Card><Title>TODO</Title></Card>
                </Form.Item>
            </Form>

            <Divider orientation={'left'}>组织配置</Divider>
            <Form layout={'vertical'}>
                <Form.Item label={'组织个数'}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <InputNumber min={1} max={20} />
                        </Col>
                        <Col span={18}>
                            <Slider min={1} max={20}/>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item label={'组织名称配置'}>
                    <Card><Title>TODO</Title></Card>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default NetworkDrawer;
