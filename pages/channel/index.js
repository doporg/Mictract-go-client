import {Badge, Col, Form, Input, Row, Select, Tag} from "antd";
import {useState, useEffect} from "react";
import * as R from "ramda";
import api from "api";
import ModelPage from "components/ModelPage/ModelPage";
import {handleErrorWithMessage, interactWithMessage} from "components/MenuLayout/MenuLayout";
import {channelColumns} from "api/model";
import {Subject} from "rxjs";

const ChannelPage = () => {
    // ========== add new channel ==========
    const [ channel, setChannel ] = useState({
        nickname: '',
        networkID: '',
        organizationIDs: [],
    });
    const [ networks, setNetworks ] = useState([]);
    const [ organizationsInNetwork, setOrganizationsInNetwork ] = useState([]);

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

    const setChannelByKey = key => value =>
        setChannel( channel => R.mergeRight(channel, { [key]: value }));

    const onNetworkChange = async networkID => {
        setChannelByKey('networkID')(networkID);

        try {
            const { data: { payload: orgs } } = await api.listOrganizationsByNetwork(networkID)
            setOrganizationsInNetwork(orgs);
        } catch (e) {
            handleErrorWithMessage(e, {
                message: 'list organizations by network',
            });
        }
    };

    // ========== presentation channel ==========
    const refresh$ = new Subject();
    const handleSubmit = async () => {
        await interactWithMessage(
            () => api.createChannel(channel),
            'create channel',
        )();
        refresh$.next();
    };

    return (
        <ModelPage
            drawerTitle={'新增通道'}
            columns={channelColumns}
            dataSourceAsync={api.listChannels}

            refreshEnabled
            refreshSubject={refresh$}
            handleSubmit={handleSubmit}
        >
            <Form layout={'vertical'}>
                <Form.Item label={'昵称'} rules={{ require: true, message: '请填写昵称' }}>
                    <Input
                        placeholder={'请填写昵称'}
                        onChange={(e) => setChannelByKey('nickname')(e.target.value)}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label={'所属网络'} rules={{ require: true, message: '请填写所属网络' }}>
                            <Select placeholder='请选择所属网络' onChange={onNetworkChange} value={channel.network}>
                                {
                                    networks
                                        .map(({ id: networkID, nickname }) =>
                                            <Select.Option key={networkID} value={networkID}>{`${networkID} - ${nickname}`}</Select.Option>
                                        )
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label={'包含组织'} rules={{ require: true, message: '请填写包含节点' }}>
                            <Select placeholder='请填写包含组织' mode="tags" onChange={setChannelByKey('organizationIDs')}>
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
            </Form>

        </ModelPage>
    );
};

export default ChannelPage;
