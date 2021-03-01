import {Badge, Button, Col, Form, InputNumber, message, Row, Select, Slider, Switch, Tag} from "antd";
import { useState } from 'react';
import api from 'api';
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import moment from 'moment';
import * as R from 'ramda';
import {useRouter} from "next/router";
import ModelPage from "components/ModelPage/ModelPage";
import PeerCountTable from "components/Network/PeerCountTable/PeerCountTable";

const interactWithMessage = (reqPromiseFn) => {
    return async () => {
        const key = moment().valueOf();
        message.loading({content: 'loading', key});

        try {
            await reqPromiseFn();
            message.success({content: 'success', key});
        } catch (e) {
            message.error({content: `error: ${e}`, key});
        }
    }
}

const NetworkPage = () => {
    // ========== add new network ==========
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

    // ========== presentation networks ==========
    const router = useRouter();
    const [ sortedInfo, setSortedInfo ] = useState({});
    const [ filteredInfo, setFilteredInfo ] = useState({});

    const handleSubmit = interactWithMessage(() => api.createNetwork(network));
    const handleStopNetwork = (id) => interactWithMessage(() => api.stopNetwork(id));
    const handleDeleteNetwork = (id) => interactWithMessage(() => api.deleteNetwork(id));

    const columns = [
        {
            key: 'name',
            dataIndex: 'name',
            title: '名称',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        },
        {
            key: 'consensus',
            dataIndex: 'consensus',
            title: '共识算法',
            filteredValue: filteredInfo?.consensus,
            filters: [
                { text: 'solo', value: 'solo' },
                { text: 'etcdRaft', value: 'etcdRaft' },
            ],
            onFilter: (value, record) => record.consensus.includes(value),
        },
        {
            key: 'tlsEnabled',
            dataIndex: 'tlsEnabled',
            title: '开启TLS',
            render: value => {
                if (value === 'true')
                    return '是';
                return '否';
            }
        },
        {
            key: 'orderers',
            dataIndex: 'orderers',
            title: '排序节点',
            render: (value) => {
                const compute = R.pipe(
                    R.map((v, i) => <Tag color='cyan' key={i}> { v.split('.')[0] } </Tag>),
                    R.splitEvery(3),
                    R.map(row => [ ...row, <br /> ]),
                    R.flatten()
                );
                return <div> { compute(value) } </div>;
            },
        },
        {
            key: 'organizations',
            dataIndex: 'organizations',
            title: '组织',
            render: (value) => {
                const compute = R.pipe(
                    R.map((v, i) => <Tag color='geekblue' key={i}> { v.split('.')[0] } </Tag>),
                    R.splitEvery(5),
                    R.map(row => [ ...row, <br /> ]),
                    R.flatten()
                );
                return <div> { compute(value) } </div>;
            },
        },
        {
            key: 'createTime',
            dataIndex: 'createTime',
            title: '创建时间',
            render: value => moment(parseInt(value)).format('YYYY-MM-DD'),
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: '状态',
            render: R.pipe(
                R.cond([
                    [ R.equals('running'),  v => [ v, 'success' ] ],
                    [ R.equals('starting'), v => [ v, 'processing' ] ],
                    [ R.equals('stopped'),  v => [ v, 'warning' ] ],
                    [ R.equals('error'),    v => [ v, 'error' ] ],
                ]),
                ([ v, status ]) => {
                    return <Tag color={status}><Badge status={status} text={v}/></Tag>;
                },
            )
        },
        {
            key: 'actions',
            dataIndex: 'actions',
            title: '操作',
            render: (_, { key }) => {
                // TODO: link to `/monitor/[id]`
                return (
                    <Button.Group>
                        <Button onClick={() => router.push(`/network/${key}`)}>查看</Button>
                        <Button onClick={handleStopNetwork(key)}>停止</Button>
                        <Button onClick={handleDeleteNetwork(key)}>删除</Button>
                    </Button.Group>
                );
            }
        }
    ];

    return (
        <ModelPage
            drawerTitle={'新增网络'}
            columns={columns}
            dataSourcePromiseFn={api.listNetworks}
            setSortedInfo={setSortedInfo}
            setFilteredInfo={setFilteredInfo}
            handleSubmit={handleSubmit}
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
        </ModelPage>
    );
};

export default NetworkPage;
