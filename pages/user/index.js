import {Button, Col, Form, Input, message, Row, Select, Tag} from "antd";
import {useState, useEffect} from "react";
import * as R from "ramda";
import api from "api";
import ModelPage from "components/ModelPage/ModelPage";
import {handleErrorWithMessage, interactWithMessage} from "components/MenuLayout/MenuLayout";

const UserPage = () => {
    // ========== add new user ==========
    const [ user, setUser ] = useState({
        nickname: '',
        role: 'user',
        organization: undefined,
        network: undefined,
        password: '',
    });

    const setUserByKey = (key) => {
        return value =>
            setUser( user =>
                R.mergeRight(user, { [key]: value })
            );
    };

    // ========== presentation networks ==========
    const [ networks, setNetworks ] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const { data: { payload: networks } } = await api.listNetworks();
                setNetworks( networks.map(R.prop('name')) )
            } catch (e) {
                handleErrorWithMessage(e, {
                    message: 'list networks',
                });
            }
        })()
    }, []);

    const [ orgsInNetwork, setOrgsInNetwork ] = useState([]);
    const onNetworkChange = async networkUrl => {
        setUserByKey('network')(networkUrl);

        try {
            const { data: { payload: orgs } } = await api.listOrganizationsByNetwork(networkUrl);
            setOrgsInNetwork(orgs);
        } catch (e) {
            handleErrorWithMessage(e, {
                message: 'list organizations by network',
            });
        }
    };

    const [ dataSource, setDataSource ] = useState([]);
    const [ sortedInfo, setSortedInfo ] = useState({});
    const [ filteredInfo, setFilteredInfo ] = useState({});

    const refresh = async () => {
        try {
            const { data: { payload: users } } = await api.listUsers();
            setDataSource(users);
        } catch (e) {
            handleErrorWithMessage(e, {
                message: 'refreshing',
            });
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleSubmit = async () => {
        await interactWithMessage(
            () => api.createUser(user),
            'create user',
        )();
        await refresh();
    };

    const handleDeleteUser = userUrl => async () => {
        await interactWithMessage(
            () => api.deleteUser(userUrl),
            'delete user',
        )();
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
            key: 'nickname',
            dataIndex: 'nickname',
            title: '昵称',
            sorter: (a, b) => a.nickname.localeCompare(b.nickname),
            sortOrder: sortedInfo.columnKey === 'nickname' && sortedInfo.order,
        },
        {
            key: 'role',
            dataIndex: 'role',
            title: '角色',
            filteredValue: filteredInfo?.role,
            filters: [
                { text: 'admin', value: 'admin' },
                { text: 'user', value: 'user' },
            ],
            onFilter: (value, record) => record.role.includes(value),
            render: value => {
                if (value === 'admin')
                    return <Tag color={'red'}>{value}</Tag>;
                else
                    return <Tag color={'blue'}>{value}</Tag>;
            }
        },
        {
            key: 'organization',
            dataIndex: 'organization',
            title: '所属组织',
            render: value => {
                const org = value.split('.')[0];
                if (org === 'orderer')
                    return <Tag color={'cyan'}>{org}</Tag>;
                else
                    return <Tag color={'geekblue'}>{org}</Tag>;
            }
        },
        {
            key: 'network',
            dataIndex: 'network',
            title: '所属网络',
            render: value => <Tag color={'green'}>{value.split('.')[0]}</Tag>
        },
        {
            key: 'actions',
            dataIndex: 'actions',
            title: '操作',
            render: (_, { key }) => {
                return (
                    <Button.Group>
                        <Button onClick={handleDeleteUser(key)}>删除</Button>
                    </Button.Group>
                );
            }
        }
    ];

    return (
        <ModelPage
            drawerTitle={'新增用户'}
            columns={columns}
            dataSource={dataSource}
            rowKey={ R.prop('name') }
            setSortedInfo={setSortedInfo}
            setFilteredInfo={setFilteredInfo}
            handleSubmit={handleSubmit}
        >
            <Form layout={'vertical'}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label={'昵称'} rules={{ require: true, message: '请填写昵称' }}>
                            <Input
                                placeholder={'请填写昵称'}
                                onChange={(e) => setUserByKey('nickname')(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'角色'} rules={{ require: true, message: '请选择角色' }}>
                            <Select placeholder='请选择角色' onChange={setUserByKey('role')} value={user.role}>
                                <Select.Option value="admin">admin</Select.Option>
                                <Select.Option value="user">user</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label={'所属网络'} rules={{ require: true, message: '请填写所属网络' }}>
                            <Select placeholder='请选择所属网络' onChange={onNetworkChange} value={user.network}>
                                {
                                    networks
                                        .map(net => <Select.Option key={net} value={net}>{net}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'所属组织'} rules={{ require: true, message: '请填写所属组织' }}>
                            <Select placeholder='请选择所属组织' onChange={setUserByKey('organization')} value={user.organization}>
                                {
                                    orgsInNetwork
                                        .map(({ name }) =>
                                            <Select.Option key={name} value={name}>{name}</Select.Option>
                                        )
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col>
                        <Form.Item label={'密码'} rules={{ require: true, message: '请填写密码' }}>
                            <Input
                                type={'password'}
                                placeholder={'请填写密码'}
                                onChange={(e) => setUserByKey('password')(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

        </ModelPage>
    );
};

export default UserPage;
