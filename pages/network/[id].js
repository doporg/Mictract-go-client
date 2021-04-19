import {useRouter} from "next/router";
import {Badge, Card, Col, Descriptions, PageHeader, Row, Statistic, Tabs, Tag} from "antd";
import MenuLayout, {refreshDataSource} from "components/MenuLayout/MenuLayout";
import {useEffect, useState} from "react";
import NetworkDetailTable from "components/Network/NetworkDetailTable/NetworkDetailTable";
import {modelColumns} from "api/model";
import api from "api";
import * as R from "ramda";
import moment from "moment";
import ComponentLoader from "components/ComponentLoader/ComponentLoader";

const { TabPane } = Tabs;

const NetworkDetailPage = () => {
    const router = useRouter();
    const { id: networkID } = router.query;

    const [ network, setNetwork ] = useState({});
    const networkIsLoading = Object.keys(network).length === 0;
    useEffect(() => {
        if (networkID)
            refreshDataSource(() => api.getNetwork({id: networkID}), setNetwork);
    }, [ networkID ]);

    const renderStatusTag = R.pipe(
        R.cond([
            [ R.equals('running'),  () => [ '运行中', 'success' ] ],
            [ R.equals('starting'), () => [ '创建中', 'processing' ] ],
            [ R.equals('stopped'),  () => [ '已停止', 'warning' ] ],
            [ R.equals('error'),    () => [ '已出错', 'error' ] ],
            [ R.T,                  () => [ '未知错', 'error' ] ],
        ]),
        ([ v, status ]) => {
            return <Tag color={status}><Badge status={status} text={v}/></Tag>;
        },
    );

    const createTime = moment.unix(network?.createTime);
    const renderNetworkDetailInfo = () => (
        <Row>
            <Col span={18}>
                <Descriptions>
                    <Descriptions.Item label={'名称'}>   {network?.nickname}</Descriptions.Item>
                    <Descriptions.Item label={'共识协议'}>{network?.consensus}</Descriptions.Item>
                    <Descriptions.Item label={'开启TLS'}>{network?.tlsEnabled ? '是': '否'}</Descriptions.Item>
                    <Descriptions.Item label={'创建时间'}>{createTime.format('YYYY-MM-DD')}</Descriptions.Item>
                    <Descriptions.Item label={'排序节点'}>{network?.orderers?.length}</Descriptions.Item>
                    <Descriptions.Item label={'组织数目'}>{network?.organizations?.length}</Descriptions.Item>
                    <Descriptions.Item label={'用户数目'}>{network?.users?.length}</Descriptions.Item>
                    <Descriptions.Item label={'通道数目'}>{network?.channels?.length}</Descriptions.Item>
                </Descriptions>
            </Col>

            <Col span={6} style={{ float: 'right', display: 'flex' }}>
                <Statistic
                    title="状态"
                    value={'运行中'}
                    style={{
                        marginRight: '32px'
                    }}
                />

                <Statistic
                    title="已运行"
                    value={`${moment().diff(createTime, 'hours')} 小时`}
                />
            </Col>
        </Row>
    );

    const renderDetailTab = () =>  (
        <Row gutter={[24, 18]} style={{ marginTop: '32px' }}>
            <Col span={24}>
                <Card title={"用户详情"} type={'inner'}>
                    <NetworkDetailTable
                        columns={modelColumns.user}
                        dataSourceAsync={async () => api.listUsersByNetwork({ networkID })}
                        initialDataSource={network.users}
                    />
                </Card>
            </Col>

            <Col span={24}>
                <Card title={"组织详情"} type={'inner'}>
                    <NetworkDetailTable
                        columns={modelColumns.organization}
                        dataSourceAsync={async () => api.listOrganizationsByNetwork({ networkID })}
                        initialDataSource={network.organizations}
                    />
                </Card>
            </Col>

            <Col span={24}>
                <Card title={"通道详情"} type={'inner'}>
                    <NetworkDetailTable
                        columns={modelColumns.channel}
                        dataSourceAsync={async () => api.listChannelsByNetwork({ networkID })}
                        initialDataSource={network.channels}
                    />
                </Card>
            </Col>

            <Col span={24}>
                <Card title={"链码详情"} type={'inner'}>
                    <NetworkDetailTable
                        columns={modelColumns.chaincode}
                        dataSourceAsync={async () => api.listChaincodesByNetwork({ networkID })}
                    />
                </Card>
            </Col>
        </Row>
    );

    return (
        <MenuLayout>
            <ComponentLoader isLoading={ networkIsLoading }>
                <PageHeader
                    onBack={() => window.history.back()}
                    title="网络详情"
                    subTitle={`ID: ${networkID}`}
                    tags={[
                        renderStatusTag(network.status),
                    ]}
                    footer={
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="详细信息" key="1"> { networkIsLoading? '': renderDetailTab() } </TabPane>
                            <TabPane tab="监控信息" key="2" />
                        </Tabs>
                    }
                >
                    { renderNetworkDetailInfo() }
                </PageHeader>
            </ComponentLoader>
        </MenuLayout>
    );
};

export default NetworkDetailPage;
