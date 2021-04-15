import {Button, Col, Form, Input, InputNumber, message, Row, Select, Slider, Tag} from "antd";
import {useEffect, useState} from 'react';
import api from 'api';
import * as R from 'ramda';
import ModelPage from "components/ModelPage/ModelPage";
import {handleErrorWithMessage, interactWithMessage} from "components/MenuLayout/MenuLayout";

const OrganizationPage = () => {
    // ========== add new organization ==========
    const [ organization, setOrganization ] = useState({
        nickname: '',
        networkID: '',
        peerCount: 2,
    });

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
        })();
    }, []);


    const setOrganizationByKey = (key) => {
        return value =>
            setOrganization( org =>
                R.mergeRight(org, { [key]: value })
            );
    }

    // ========== presentation networks ==========
    const [ dataSource, setDataSource ] = useState([]);
    const [ sortedInfo, setSortedInfo ] = useState({});
    const [ filteredInfo, setFilteredInfo ] = useState({});

    const refreshAsync = async () => {
        try {
            const { data: { payload: orgs } } = await api.listOrganizations();
            setDataSource(orgs);
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
        await interactWithMessage(
            () => api.createOrganization(organization),
            'create organization',
        )();
        await refreshAsync();
    };

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
            sorter: (a, b) => a.nickname.localeCompare(b.nickname),
            sortOrder: sortedInfo.columnKey === 'nickname' && sortedInfo.order,
        },
        // TODO: change url into id model
        {
            key: 'peers',
            dataIndex: 'peers',
            title: '包含节点',
            render: R.pipe(
                R.map( name => <Tag key={name} color={'purple'}>{name.split('.')[0]}</Tag>),
                R.splitEvery(5),
                R.addIndex(R.map)((arr, i) => R.append(<br key={i}/>)(arr)),
                R.flatten,
            ),
        },
        {
            key: 'networkID',
            dataIndex: 'networkID',
            title: '所属网络ID',
            render: value => <Tag key={value} color={'green'}>{value}</Tag>
        },
    ];

    return (
        <ModelPage
            drawerTitle={'新增组织'}
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
                        onChange={(e) => setOrganizationByKey('nickname')(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label={'所属网络'} rules={{ require: true, message: '请填写所属网络' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Select placeholder='请选择所属网络' onChange={setOrganizationByKey('networkID')} value={organization.networkUrl}>
                                {
                                    networks
                                        .map(({ id: networkID, nickname }) =>
                                            <Select.Option key={networkID} value={networkID}>{`${networkID} - ${nickname}`}</Select.Option>
                                        )
                                }
                            </Select>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item label={'节点个数'}>
                    <Row gutter={16}>
                        <Col span={6}>
                        <InputNumber min={1} max={20} onChange={setOrganizationByKey('peerCount')} value={organization.peerCount} />
                        </Col>
                        <Col span={18}>
                            <Slider min={1} max={20} onChange={setOrganizationByKey('peerCount')} value={organization.peerCount} />
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </ModelPage>
    );
};

export default OrganizationPage;
