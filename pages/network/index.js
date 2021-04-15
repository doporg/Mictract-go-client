import {Badge, Button, Col, Form, Input, InputNumber, message, Row, Select, Slider, Switch, Tag} from "antd";
import {useEffect, useState} from 'react';
import api from 'api';
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import moment from 'moment';
import * as R from 'ramda';
import {useRouter} from "next/router";
import ModelPage from "components/ModelPage/ModelPage";
import PeerCountTable from "components/Network/PeerCountTable/PeerCountTable";
import {handleErrorWithMessage, interactWithMessage} from "components/MenuLayout/MenuLayout";

const NetworkPage = () => {
    // ========== add new network ==========
    const [ network, setNetwork ] = useState({
        nickname: '',
        consensus: 'solo',
        tlsEnabled: true,
        ordererCount: 1,
        peerCounts: [ 2, 2 ],
        organizationNicknames: [ 'org1', 'org2' ],
    });

    const setNetworkByKey = (key) => {
        return value =>
            setNetwork( network =>
                R.mergeRight(network, { [key]: value })
            );
    }

    const setOrgCount = (count) => {
        const diff = count - network.peerCounts.length;
        const reduceOrExpand = fill => diff < 0 ?
            R.take(count) :
            R.concat(R.__, R.repeat(fill)(diff));

        const peerCounts = reduceOrExpand(2)(network.peerCounts);
        const organizationNicknames = reduceOrExpand('orgX')(network.organizationNicknames)
            .map((nickname, idx) => {
                if (nickname === 'orgX')
                    return `org${idx+1}`;
                return nickname;
            });

        setNetwork( network =>
            R.mergeRight(network, { peerCounts, organizationNicknames })
        )
    }

    const setPeerCountsByKey = (key, value) => {
        setNetwork(network => {
            // NOTE: here use shallow copy because diffing algo is based on the pointer address.
            network.peerCounts[key] = value;
            return { ...network };
        })
    }

    const setOrganizationNicknameByKey = (key, value) => {
        setNetwork(network => {
            // NOTE: here use shallow copy because diffing algo is based on the pointer address.
            network.organizationNicknames[key] = value;
            return { ...network };
        })
    }

    // ========== presentation networks ==========
    const router = useRouter();
    const [ dataSource, setDataSource ] = useState([]);
    const [ sortedInfo, setSortedInfo ] = useState({});
    const [ filteredInfo, setFilteredInfo ] = useState({});

    const refreshAsync = async () => {
        try {
            const { data: {payload: networks} } = await api.listNetworks();
            setDataSource(networks);
        } catch (e) {
            handleErrorWithMessage(e, {
                message: 'refreshing'
            });
        }
    };

    useEffect(() => {
        refreshAsync();
    }, []);

    const handleSubmit = async () => {
        await interactWithMessage(
            () => api.createNetwork(network),
            'create network',
        )();
        await refreshAsync();
    };

    const handleDeleteNetwork = networkID => async () => {
        await interactWithMessage(
            () => api.deleteNetwork({ id: networkID }),
            'delete network',
        )();
        await refreshAsync();
    }

    const columns = [
        {
            key: 'id',
            dataIndex: 'id',
            title: 'ID',
            sorter: (a, b) => a.id - b.id,
            sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
        },
        {
            key: 'nickname',
            dataIndex: 'nickname',
            title: '昵称',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortOrder: sortedInfo.columnKey === 'nickname' && sortedInfo.order,
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
            render: value => value ? '是' : '否',
        },
        {
            key: 'orderers',
            dataIndex: 'orderers',
            title: '排序节点ID',
            render: value => {
                const compute = R.pipe(
                    R.map(({ id: ordererID }) => <Tag color='cyan' key={ordererID}> { ordererID } </Tag>),
                    R.splitEvery(3),
                    R.addIndex(R.map)((row, i) => [ ...row, <br key={i}/> ]),
                    R.flatten()
                );
                return <div> { compute(value) } </div>;
            },
        },
        {
            key: 'organizations',
            dataIndex: 'organizations',
            title: '组织ID',
            render: value => {
                const compute = R.pipe(
                    R.map(({ id: organizationID }) => <Tag color='geekblue' key={organizationID}> { organizationID } </Tag>),
                    R.splitEvery(5),
                    R.addIndex(R.map)((row, i) => [ ...row, <br key={i}/> ]),
                    R.flatten()
                );
                return <div> { compute(value) } </div>;
            },
        },
        {
            key: 'createTime',
            dataIndex: 'createTime',
            title: '创建时间',
            render: value => moment.unix(value).format('YYYY-MM-DD'),
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: '状态',
            render: R.pipe(
                R.cond([
                    [ R.equals('running'),  () => [ '运行中', 'success' ] ],
                    [ R.equals('starting'), () => [ '创建中', 'processing' ] ],
                    [ R.equals('stopped'),  () => [ '已停止', 'warning' ] ],
                    [ R.equals('error'),    () => [ '已出错', 'error' ] ],
                    [ R.T,                    () => [ '未知错', 'error' ] ],
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
            render: (_, { id: networkID }) => {
                // TODO: link to `/monitor/[id]`
                return (
                    <Button.Group key={networkID}>
                        <Button onClick={() => router.push(`/network/${networkID}`)}>查看</Button>
                        <Button onClick={handleDeleteNetwork(networkID)}>删除</Button>
                    </Button.Group>
                );
            }
        }
    ];

    return (
        <ModelPage
            drawerTitle={'新增网络'}
            columns={columns}
            dataSource={dataSource}
            rowKey={ R.prop('name') }
            setSortedInfo={setSortedInfo}
            setFilteredInfo={setFilteredInfo}

            enableRefresh
            onRefreshAsync={refreshAsync}

            handleSubmit={handleSubmit}
        >
            <Form layout={'vertical'}>
                <Form.Item label={'昵称'} rules={{ require: true, message: '请填写昵称' }}>
                    <Input
                        placeholder={'请填写昵称'}
                        onChange={(e) => setNetworkByKey('nickname')(e.target.value)}
                    />
                </Form.Item>

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
                                disabled
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
                <Row gutter={18}>
                    <Col span={12}>
                        <Form.Item label={'排序节点个数'}>
                            <InputNumber min={1} max={10} onChange={setNetworkByKey('ordererCount')} value={network.ordererCount} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'组织个数'}>
                            <InputNumber min={1} max={20} onChange={setOrgCount} value={network.peerCounts.length} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label={'节点个数'}>
                    <PeerCountTable
                        onPeerCountChange={setPeerCountsByKey}
                        onOrganizationNicknameChange={setOrganizationNicknameByKey}
                        peerCounts={network.peerCounts}
                        organizationNicknames={network.organizationNicknames}
                    />
                </Form.Item>
            </Form>
        </ModelPage>
    );
};

export default NetworkPage;
