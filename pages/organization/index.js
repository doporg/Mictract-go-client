import {Col, Form, Input, InputNumber, Row, Select, Slider} from "antd";
import {useEffect, useState} from 'react';
import api from 'api';
import {modelColumns} from "api/model";
import * as R from 'ramda';
import ModelPage from "components/ModelPage/ModelPage";
import {handleErrorWithMessage, interactWithMessage} from "components/MenuLayout/MenuLayout";
import {Subject} from "rxjs";

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
    const refresh$ = new Subject();
    const handleSubmit = async () => {
        await interactWithMessage(
            () => api.createOrganization(organization),
            'create organization',
        )();
        refresh$.next();
    };

    return (
        <ModelPage
            drawerTitle={'新增组织'}
            columns={modelColumns.organization}
            dataSourceAsync={api.listOrganizations}

            refreshEnabled
            refreshSubject={refresh$}
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
