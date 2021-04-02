import {Badge, Button, Col, Form, Input, message, Row, Select, Switch, Tag, Upload} from "antd";
import {useEffect, useState} from 'react';
import api from 'api';
import {CheckOutlined, CloseOutlined, UploadOutlined} from "@ant-design/icons";
import * as R from 'ramda';
import ModelPage from "components/ModelPage/ModelPage";
import {handleErrorWithMessage, interactWithMessage} from "components/MenuLayout/MenuLayout";

const NetworkPage = () => {
    // ========== add new chaincode ==========
    const [ chaincode, setChaincode ] = useState({
        file: undefined,
        nickname: '',
        label: '',
        policy: '',
        version: '',
        sequence: 1,
        initRequired: true,
        network: '',
        organization: '',
        peers: [],
    });

    const setChaincodeByKey = (key) => {
        return value =>
            setChaincode( network =>
                R.mergeRight(network, { [key]: value })
            );
    }

    const [ networks, setNetworks ] = useState([]);
    const [ organizationsInNetwork, setOrganizationsInNetwork ] = useState([]);
    const [ peersInOrganization, setPeersInOrganization ] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data: { payload: networks } } = await api.listNetworks();
                setNetworks(networks.map(R.prop('name')));
            } catch (e) {
                handleErrorWithMessage(e, {
                    message: 'list networks',
                });
            }
        })();
    }, []);

    const onOrganizationChange = async organizationUrl => {
        setChaincodeByKey('organization')(organizationUrl);

        try {
            const { data: { payload: peers } } = await api.listPeersByOrganization(organizationUrl)
            setPeersInOrganization(peers);
        } catch (e) {
            handleErrorWithMessage(e, {
                message: 'list peers by organization',
            });
        }
    };

    const onNetworkChange = async networkUrl => {
        setChaincodeByKey('network')(networkUrl);

        try {
            const { data: { payload: orgs } } = await api.listOrganizationsByNetwork(networkUrl)
            setOrganizationsInNetwork(orgs);
        } catch (e) {
            handleErrorWithMessage(e, {
                message: 'list organizations by network',
            });
        }
    };

    // ========== presentation chaincode ==========
    const [ dataSource, setDataSource ] = useState([]);
    const [ sortedInfo, setSortedInfo ] = useState({});
    const [ filteredInfo, setFilteredInfo ] = useState({});

    const refreshAsync = async () => {
        try {
            const { data: {payload: chaincodes} } = await api.listChaincodes();
            setDataSource(chaincodes);
        } catch (e) {
            handleErrorWithMessage(e, {
                message: 'refreshing',
            });
        }
    };

    useEffect(() => {
        refreshAsync();
    }, []);

    const handleSubmit = async () => {
        const form = new FormData();
        for (const key of Object.keys(chaincode))
            form.append(key, chaincode[key]);

        await interactWithMessage(
            () => api.createChaincode(form),
            'create chaincode',
        )();
        await refreshAsync();
    };

    const handleInvokeChaincode = chaincodeName => async () => {
        await interactWithMessage(
            () => api.invokeChaincode(networkUrl),
            'invoke chaincode'
        )();
        await refreshAsync();
    };

    const columns = [
        {
            key: 'nickname',
            dataIndex: 'nickname',
            title: '昵称',
            sorter: (a, b) => a.nickname.localeCompare(b.nickname),
            sortOrder: sortedInfo.columnKey === 'nickname' && sortedInfo.order,
        },
        {
            key: 'ccid',
            dataIndex: 'ccid',
            title: '链码ID',
        },
        {
            key: 'label',
            dataIndex: 'label',
            title: '标签',
        },
        // {
        //     key: 'address',
        //     dataIndex: 'address',
        //     title: '地址',
        // },
        {
            key: 'policy',
            dataIndex: 'policy',
            title: '策略',
        },
        {
            key: 'version',
            dataIndex: 'version',
            title: '版本',
        },
        {
            key: 'sequence',
            dataIndex: 'sequence',
            title: '序列号',
        },
        // {
        //     key: 'package_id',
        //     dataIndex: 'package_id',
        //     title: '包ID',
        // },
        {
            key: 'initRequired',
            dataIndex: 'initRequired',
            title: '需要初始化',
            render: value => value ? '是' : '否',
        },
        {
            key: 'channelName',
            dataIndex: 'channelName',
            title: '所属通道',
            render: value => <Tag color={'purple'}>{value}</Tag>
        },
        {
            key: 'networkUrl',
            dataIndex: 'networkUrl',
            title: '所属网络',
            render: value => <Tag color={'green'}>{value}</Tag>
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: '状态',
            render: R.pipe(
                R.cond([
                    [ R.equals('starting'),     () => [ '创建中', 'processing' ] ],
                    [ R.equals('unpacking'),    () => [ '解压中', 'processing' ] ],
                    [ R.equals('installing'),   () => [ '安装中', 'processing' ] ],
                    [ R.equals('building'),     () => [ '构建中', 'processing' ] ],
                    [ R.equals('running'),      () => [ '运行中', 'success' ] ],
                    [ R.equals('stopped'),      () => [ '已停止', 'warning' ] ],
                    [ R.equals('error'),        () => [ '已出错', 'error' ] ],
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
            render: (_, { ccid }) => {
                return (
                    <Button.Group key={ccid}>
                        <Button onClick={handleInvokeChaincode(ccid)}>调用链码</Button>
                    </Button.Group>
                );
            }
        }
    ];

    return (
        <ModelPage
            drawerTitle={'新增链码'}
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
                        onChange={(e) => setChaincodeByKey('nickname')(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label={'标签'} rules={{ require: true, message: '请填写标签' }}>
                    <Input
                        placeholder={'请填写标签'}
                        onChange={(e) => setChaincodeByKey('label')(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label={'安装策略'} rules={{ require: true, message: '请填写安装策略' }}>
                    <Input
                        placeholder={"默认值为 OR('org1MSP.member')"}
                        onChange={(e) => setChaincodeByKey('policy')(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label={'版本'} rules={{ require: true, message: '请填写版本' }}>
                    <Input
                        placeholder={'请填写版本'}
                        onChange={(e) => setChaincodeByKey('version')(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label={'序列号'} rules={{ require: true, message: '请填写序列号' }}>
                    <Input
                        placeholder={'请填写序列号'}
                        defaultValue={'1'}
                        onChange={(e) => setChaincodeByKey('sequence')(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label={'需要初始化'} >
                    <Switch
                        defaultChecked
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        onChange={setChaincodeByKey('initRequired')}
                    />
                </Form.Item>

                <Form.Item label={'上传链码文件'} >
                    <Upload
                        onRemove={_ => {
                            setChaincodeByKey('file')(undefined);
                        }}
                        beforeUpload={file => {
                            setChaincodeByKey('file')(file);
                            return false;
                        }}
                    >
                        <Button icon={<UploadOutlined />}>点击上传</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label={'所属网络'} rules={{ require: true, message: '请填写所属网络' }}>
                    <Select placeholder='请选择所属网络' onChange={onNetworkChange} value={chaincode.network}>
                        {
                            networks
                                .map(net => <Select.Option key={net} value={net}>{net.split('.')[0]}</Select.Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item label={'所属组织'} rules={{ require: true, message: '请填写所属组织' }}>
                    <Select placeholder='请选择所属组织' onChange={onOrganizationChange} value={chaincode.organization}>
                        {
                            organizationsInNetwork
                                .map(({name}) => <Select.Option key={name} value={name}>{name.split('.')[0]}</Select.Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item label={'包含Peer'} rules={{ require: true, message: '请填写包含Peer' }}>
                    <Select placeholder='请选择包含Peer' mode="tags" onChange={setChaincodeByKey('peers')}>
                        {
                            peersInOrganization
                                .map(({name}) => <Select.Option key={name} value={name}>{name.split('.')[0]}</Select.Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        </ModelPage>
    );
};

export default NetworkPage;
