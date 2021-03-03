import moment from "moment";
import {Button, Col, Form, Input, message, Row, Select, Tag} from "antd";
import {useState, useEffect} from "react";
import * as R from "ramda";
import api from "api";
import ModelPage from "components/ModelPage/ModelPage";

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

const ChannelPage = () => {
    // ========== add new channel ==========
    const [ channel, setChannel ] = useState({
        name: '',
        network: '',
        peers: [],
    });
    const [ networks, setNetworks ] = useState([]);
    const [ peersInNetwork, setPeersInNetwork ] = useState([]);

    useEffect(() => {
        (async () => {
            const { data: networks } = await api.listNetworks();
            setNetworks(networks.map(R.prop('name')));
        })();
    }, []);

    // `getShorterPeerName` here just includes peer number and organization number.
    // Example: peer1.org1.net1.com --> peer1-org1
    const getShorterPeerName = R.pipe(
        R.split('.'),
        R.take(2),
        R.join('-'),
    );

    const setChannelByKey = key => value =>
        setChannel( channel => R.mergeRight(channel, { [key]: value }));

    const onNetworkChange = async network => {
        setChannelByKey('network')(network);

        // TODO: handle error
        const { data: peers } = await api.listPeersByNetwork({network})
        setPeersInNetwork(peers);
    };

    // ========== presentation channel ==========
    const [ dataSource, setDataSource ] = useState([]);
    const [ sortedInfo, setSortedInfo ] = useState({});
    const refresh = async () => {
        const { data: channels } = await api.listChannel();
        setDataSource(channels);
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleSubmit = async () => {
        await interactWithMessage(() => api.createChannel(channel))();
        await refresh();
    };

    const handleDeleteChannel = name => async () => {
        await interactWithMessage(() => api.deleteChannel(name))();
        await refresh();
    }

    const columns = [
        {
            key: 'name',
            dataIndex: 'name',
            title: '名称 / URL',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        },
        {
            key: 'peers',
            dataIndex: 'peers',
            title: '包含节点',
            render: R.pipe(
                R.map( name => <Tag key={name} color={'purple'}>{getShorterPeerName(name)}</Tag>),
                R.splitEvery(5),
                R.map(R.append(<br />)),
                R.flatten,
            ),
        },
        {
            key: 'network',
            dataIndex: 'network',
            title: '所属网络',
            render: value => <Tag key={value} color={'green'}>{value.split('.')[0]}</Tag>
        },
        {
            key: 'actions',
            dataIndex: 'actions',
            title: '操作',
            render: (_, { name }) => {
                return (
                    <Button.Group>
                        <Button onClick={handleDeleteChannel(name)}>删除</Button>
                    </Button.Group>
                );
            }
        }
    ];

    // TODO: unique key
    return (
        <ModelPage
            drawerTitle={'新增通道'}
            columns={columns}
            dataSource={dataSource}
            setSortedInfo={setSortedInfo}
            handleSubmit={handleSubmit}
        >
            <Form layout={'vertical'}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label={'通道名'} rules={{ require: true, message: '请填写通道名' }}>
                            <Input placeholder='请填写通道名' onChange={e => setChannelByKey('name')(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'所属网络'} rules={{ require: true, message: '请填写所属网络' }}>
                            <Select placeholder='请选择所属网络' onChange={onNetworkChange} value={channel.network}>
                                {
                                    networks
                                        .map(net => <Select.Option key={net} value={net}>{net}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label={'包含节点'} rules={{ require: true, message: '请填写包含节点' }}>
                            <Select placeholder='请填写包含节点' mode="tags" onChange={setChannelByKey('peers')}>
                                {
                                    peersInNetwork
                                        .map(name =>
                                            <Select.Option key={name} value={name}>{getShorterPeerName(name)}</Select.Option>
                                        )
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

        </ModelPage>
    );
};

export default ChannelPage;
