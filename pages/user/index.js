import {Button, Col, Form, Input, message, Row, Select, Tag} from "antd";
import {useState, useEffect} from "react";
import * as R from "ramda";
import api from "api";
import ModelPage from "components/ModelPage/ModelPage";
import {handleErrorWithMessage, interactWithMessage} from "components/MenuLayout/MenuLayout";
import {userColumns} from "../../api/model";
import {Subject} from "rxjs";

const UserPage = () => {
    // ========== add new user ==========
    const [ user, setUser ] = useState({
        nickname: '',
        role: 'user',
        organizationID: undefined,
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
                setNetworks(networks);
            } catch (e) {
                handleErrorWithMessage(e, {
                    message: 'list networks',
                });
            }
        })()
    }, []);

    const [ organizationsInNetwork, setOrganizationsInNetwork ] = useState([]);
    const onNetworkChange = async networkID => {
        try {
            const { data: { payload: orgs } } = await api.listOrganizationsByNetwork({networkID});
            setOrganizationsInNetwork(orgs);
        } catch (e) {
            handleErrorWithMessage(e, {
                message: 'list organizations by network',
            });
        }
    };

    const columns = [...userColumns];
    columns.push({
        key: 'actions',
        dataIndex: 'actions',
        title: '操作',
        render: (_, { id }) => {
            return (
                <Button.Group key={id}>
                    <Button onClick={handleDeleteUser(id)}>删除</Button>
                </Button.Group>
            );
        }
    })

    const refresh$ = new Subject();
    const handleSubmit = async () => {
        await interactWithMessage(
            () => api.createUser(user),
            'create user',
        )();
        refresh$.next();
    };

    const handleDeleteUser = userID => async () => {
        await interactWithMessage(
            () => api.deleteUser({id: userID}),
            'delete user',
        )();
        refresh$.next();
    }


    // TODO: change dataSource into dataSourceAsync, refreshEnable, refreshSubject
    return (
        <ModelPage
            drawerTitle={'新增用户'}
            columns={columns}
            dataSourceAsync={api.listUsers}

            refreshSubject={refresh$}
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
                                        .map(({ id: networkID, nickname }) =>
                                            <Select.Option key={networkID} value={networkID}>{`${networkID} - ${nickname}`}</Select.Option>
                                        )
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'所属组织'} rules={{ require: true, message: '请填写所属组织' }}>
                            <Select placeholder='请选择所属组织' onChange={setUserByKey('organizationID')} value={user.organization}>
                                {
                                    organizationsInNetwork
                                        .map(({ id: organizationID, nickname }) =>
                                            <Select.Option key={organizationID} value={organizationID}>{`${organizationID} - ${nickname}`}</Select.Option>
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
