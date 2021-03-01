import {Button, Col, Drawer, Form, InputNumber, Row, Select, Slider, Switch} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {useState} from "react";
import * as R from 'ramda';
import PeerCountTable from "../PeerCountTable/PeerCountTable";

const NetworkDrawer = ({ onClose, visible, handleSubmit }) => {
    const [ network, setNetwork ] = useState({
        consensus: 'solo',
        tlsEnabled: true,
        ordererCount: 1,
        peerCounts: [ 2, 2 ],
    });

    const setNetworkByKey = (key) => {
        return value =>
            setNetwork( network =>
                R.mergeRight(network, { [key]: value })
            );
    }

    const setOrgCount = (count) => {
        const diff = count - network.peerCounts.length;
        const compute = diff < 0 ?
            R.take(count) :
            R.concat(R.__, R.repeat(2)(diff));
        const peerCounts = compute(network.peerCounts)

        setNetwork( network =>
            R.mergeRight(network, { peerCounts })
        )
    }

    const setPeerCountsByKey = (key, value) => {
        setNetwork(network => {
            // NOTE: here use shallow copy because diffing algo is based on the pointer address.
            network.peerCounts[key] = value;
            return { ...network };
        })
    }

    return (
        <Drawer
            title="新增网络"
            width={450}
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
                    <Col span={18}>
                        <Form.Item label={'共识协议'} rules={{ require: true, message: '请选择共识协议' }}>
                            <Select placeholder='请选择共识协议' onChange={setNetworkByKey('consensus')} value={network.consensus}>
                                <Select.Option value="solo">solo</Select.Option>
                                <Select.Option value="etcdraft">etcdRaft</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label={'开启TLS'} >
                            <Switch
                                defaultChecked
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                onChange={setNetworkByKey('tlsEnabled')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <Form layout={'vertical'}>
                <Form.Item label={'排序节点个数'}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <InputNumber min={1} max={10} onChange={setNetworkByKey('ordererCount')} value={network.ordererCount} />
                        </Col>
                        <Col span={18}>
                            <Slider min={1} max={10} onChange={setNetworkByKey('ordererCount')} value={network.ordererCount} />
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item label={'组织个数'}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <InputNumber min={1} max={20} onChange={setOrgCount} value={network.peerCounts.length} />
                        </Col>
                        <Col span={18}>
                            <Slider min={1} max={20} onChange={setOrgCount} value={network.peerCounts.length} />
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item label={'节点个数'}>
                    <PeerCountTable onChange={setPeerCountsByKey} peerCounts={network.peerCounts} />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default NetworkDrawer;
