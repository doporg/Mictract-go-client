import {Badge, Col, Form, Row, Select, Tag} from "antd";
import {useState, useEffect} from "react";
import * as R from "ramda";
import api from "api";
import ModelPage from "components/ModelPage/ModelPage";
import {interactWithMessage} from "pages/index";

const ChannelPage = () => {
    // ========== add new channel ==========
    const [ channel, setChannel ] = useState({
        network: '',
        organizations: [],
    });
    const [ networks, setNetworks ] = useState([]);
    const [ organizationsInNetwork, setOrganizationsInNetwork ] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data: { payload: networks } } = await api.listNetworks();
                setNetworks(networks.map(R.prop('name')));
            } catch (e) {
                message.error(e);
            }
        })();
    }, []);

    const setChannelByKey = key => value =>
        setChannel( channel => R.mergeRight(channel, { [key]: value }));

    const onNetworkChange = async networkUrl => {
        setChannelByKey('network')(networkUrl);

        try {
            const { data: { payload: orgs } } = await api.listOrganizationsByNetwork(networkUrl)
            setOrganizationsInNetwork(orgs);
        } catch (e) {
            message.error(e);
        }
    };

    // ========== presentation channel ==========
    const [ dataSource, setDataSource ] = useState([]);
    const [ sortedInfo, setSortedInfo ] = useState({});
    const refreshAsync = async () => {
        try {
            const { data: { payload: channels } } = await api.listChannels();
            setDataSource(channels);
        } catch (e) {
            message.error(e);
        }
    };

    useEffect(() => {
        refreshAsync();
    }, []);

    const handleSubmit = async () => {
        await interactWithMessage(() => api.createChannel(channel))();
        await refreshAsync();
    };

    const columns = [
        {
            key: 'name',
            dataIndex: 'name',
            title: '名称 / URL',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        },
        {
            key: 'organizations',
            dataIndex: 'organizations',
            title: '包含组织',
            render: R.pipe(
                R.map( name => <Tag key={name} color={'purple'}>{name.split('.')[0]}</Tag>),
                R.splitEvery(5),
                R.addIndex(R.map)((arr, i) => R.append(<br key={i}/>)(arr)),
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
            key: 'status',
            dataIndex: 'status',
            title: '状态',
            render: R.pipe(
                R.cond([
                    [ R.equals('running'),  () => [ '运行中', 'success' ] ],
                    [ R.equals('starting'), () => [ '创建中', 'processing' ] ],
                    [ R.equals('stopped'),  () => [ '已停止', 'warning' ] ],
                    [ R.equals('error'),    () => [ '已出错', 'error' ] ],
                    [ R.T,                     () => [ '未知错', 'error' ] ],
                ]),
                ([ v, status ]) => {
                    return <Tag color={status}><Badge status={status} text={v}/></Tag>;
                },
            )
        },
    ];

    return (
        <ModelPage
            drawerTitle={'新增通道'}
            columns={columns}
            dataSource={dataSource}
            rowKey={ record => `${record.name}-${record.network}` }
            setSortedInfo={setSortedInfo}

            enableRefresh
            onRefreshAsync={refreshAsync}

            handleSubmit={handleSubmit}
        >
            <Form layout={'vertical'}>
                <Row gutter={16}>
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
                        <Form.Item label={'包含组织'} rules={{ require: true, message: '请填写包含节点' }}>
                            <Select placeholder='请填写包含组织' mode="tags" onChange={setChannelByKey('organizations')}>
                                {
                                    organizationsInNetwork
                                        .map(({name}) =>
                                            <Select.Option key={name} value={name}>{name.split('.')[0]}</Select.Option>
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
