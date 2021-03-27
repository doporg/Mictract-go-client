import {Button, Col, Form, InputNumber, message, Row, Select, Slider, Tag} from "antd";
import {useEffect, useState} from 'react';
import api from 'api';
import * as R from 'ramda';
import ModelPage from "components/ModelPage/ModelPage";
import {interactWithMessage} from "pages/index";

const OrganizationPage = () => {
    // ========== add new organization ==========
    const [ organization, setOrganization ] = useState({
        networkUrl: '',
        peerCount: 2,
    });

    const [ networks, setNetworks ] = useState([]);

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
            message.error(e);
        }
    };

    useEffect(() => {
        refreshAsync();
    }, []);

    const handleSubmit = async () => {
        await interactWithMessage(() => api.createOrganization(organization))();
        await refreshAsync();
    };

    const columns = [
        {
            key: 'name',
            dataIndex: 'name',
            title: '名称',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        },
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
            key: 'network',
            dataIndex: 'network',
            title: '所属网络',
            render: value => <Tag key={value} color={'green'}>{value.split('.')[0]}</Tag>
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
                <Form.Item label={'所属网络'} rules={{ require: true, message: '请填写所属网络' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Select placeholder='请选择所属网络' onChange={setOrganizationByKey('networkUrl')} value={organization.networkUrl}>
                                {
                                    networks
                                        .map(net => <Select.Option key={net} value={net}>{net}</Select.Option>)
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
