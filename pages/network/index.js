import {Badge, Button, Col, Form, Input, InputNumber, message, Row, Select, Slider, Switch, Tag} from "antd";
import {useEffect, useState} from 'react';
import api from 'api';
import {networkColumns, withInfos, withSortedInfo} from "api/model";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import * as R from 'ramda';
import {useRouter} from "next/router";
import ModelPage from "components/ModelPage/ModelPage";
import PeerCountTable from "components/Network/PeerCountTable/PeerCountTable";
import {handleErrorWithMessage, interactWithMessage} from "components/MenuLayout/MenuLayout";
import {Subject} from "rxjs";

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
    const columns = [...networkColumns];
    columns.push({
        key: 'actions',
        dataIndex: 'actions',
        title: '操作',
        render: (_, { id: networkID }) => {
            return (
                <Button.Group key={networkID}>
                    <Button onClick={() => router.push(`/network/${networkID}`)}>查看</Button>
                    <Button onClick={handleDeleteNetwork(networkID)}>删除</Button>
                </Button.Group>
            );
        }
    });

    const refresh$ = new Subject();
    const handleSubmit = async () => {
        await interactWithMessage(
            () => api.createNetwork(network),
            'create network',
        )();
        refresh$.next();
    };

    const handleDeleteNetwork = networkID => async () => {
        await interactWithMessage(
            () => api.deleteNetwork({ id: networkID }),
            'delete network',
        )();
        refresh$.next();
    }

    return (
        <ModelPage
            drawerTitle={'新增网络'}
            columns={columns}
            dataSourceAsync={api.listNetworks}

            refreshEnabled
            refreshSubject={refresh$}
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
