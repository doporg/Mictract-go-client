import {Badge, Button, Col, Form, Input, message, Modal, Row, Select, Switch, Tag, Upload} from "antd";
import {useEffect, useState} from 'react';
import api from 'api';
import {CheckOutlined, CloseOutlined, UploadOutlined} from "@ant-design/icons";
import * as R from 'ramda';
import ModelPage from "components/ModelPage/ModelPage";
import {handleErrorWithMessage, interactWithMessage, refreshDataSource} from "components/MenuLayout/MenuLayout";
import {modelColumns, models} from "api/model";
import {Subject} from "rxjs";
import ModelDetailModal from "../../components/ModelDetailModal/ModelDetailModal";

const ChaincodePage = () => {
    // ========== add new chaincode ==========
    const [ chaincode, setChaincode ] = useState({
        file: undefined,
        nickname: '',
        label: '',
        policy: '',
        version: '',
        sequence: 1,
        initRequired: true,
        channelID: '',
    });

    const setChaincodeByKey = (key) => {
        return value =>
            setChaincode( network =>
                R.mergeRight(network, { [key]: value })
            );
    }

    const [ channels, setChannels ] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data: { payload: channels } } = await api.listChannels();
                setChannels(channels)
            } catch (e) {
                handleErrorWithMessage(e, {
                    message: 'list channels',
                });
            }
        })();
    }, []);

    // ========== presentation chaincode ==========
    const refresh$ = new Subject();
    const [ channel, setChannel ] = useState({ organizations: [] });
    const [ invokeReq, setInvokeReq ] = useState({
        chaincodeID: 0,
        // peerURLs are the peers used to commit and invoke the chaincode
        peerURLs: [],
        args: [],
        invokeType: '',
        userID:[]
    });

    const setInvokeReqByKey = key => value =>
        setInvokeReq(invokeReq => R.mergeRight(invokeReq, { [key]: value }));

    const [ invokeModalVisible, setInvokeModalVisible ] = useState(false);
    const showInvokeModal = (chaincodeID, channelID) => async () => {
        // FIXME: how to ensure the `invokeReq` changes before the modal open?
        setInvokeReqByKey('chaincodeID')(chaincodeID);
        refreshDataSource(() => api.getChannel({id: channelID}), setChannel)
            .then(() => {
                setInvokeModalVisible(true);
                console.log(channel);
            });
    };

    const handleInvokeModalOk = async () => {
        setInvokeModalVisible(false);
        console.log(JSON.stringify(invokeReq));
        await interactWithMessage(
            () => api.invokeChaincode(invokeReq),
            'invoke chaincode'
        )();
        refresh$.next();
    };

    const [ modalVisible, setModalVisible ] = useState(false);
    const [ modalRecord, setModalRecord ] = useState({});
    const handleShowDetailModal = record => {
        setModalVisible(true);
        setModalRecord(record);
    };

    const columns = [...modelColumns.chaincode];
    columns.push({
        key: 'actions',
        dataIndex: 'actions',
        title: '操作',
        render: (_, record) => {
            const { id, channelID, status } = record;
            if (status !== 'running')
                return (
                    <Button.Group key={id}>
                        <Button onClick={() => handleShowDetailModal(record)}>更多</Button>
                        <Button disabled onClick={showInvokeModal(id, channelID)}>调用</Button>
                    </Button.Group>
                );

            return (
                <Button.Group key={id}>
                    <Button onClick={() => handleShowDetailModal(record)}>更多</Button>
                    <Button onClick={showInvokeModal(id, channelID)}>调用</Button>
                </Button.Group>
            );
        }
    });

    const handleSubmit = async () => {
        const form = new FormData();
        for (const key of Object.keys(chaincode))
            form.append(key, chaincode[key]);

        await interactWithMessage(
            () => api.createChaincode(form),
            'create chaincode',
        )();
        refresh$.next();
    };


    return (
        <>
            <ModelPage
                drawerTitle={'新增链码'}
                columns={columns}
                dataSourceAsync={api.listChaincodes}

                refreshEnabled
                refreshSubject={refresh$}
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
                            placeholder={"样例： OR('orgXxxMSP.member')"}
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
                            disabled
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

                    <Form.Item label={'所属通道'} rules={{ require: true, message: '请填写所属通道' }}>
                        <Select placeholder='请选择所属通道' onChange={setChaincodeByKey('channelID')} value={chaincode.channelID}>
                            {
                                channels
                                    .map(({ id: channelID, nickname }) =>
                                        <Select.Option key={channelID} value={channelID}>{`${channelID} - ${nickname}`}</Select.Option>
                                    )
                            }
                        </Select>
                    </Form.Item>
                </Form>


            </ModelPage>

            <Modal
                title={'调用链码'}
                visible={invokeModalVisible}
                onOk={handleInvokeModalOk}
                onCancel={() => setInvokeModalVisible(false)}
            >
                <Form layout={'vertical'}>

                    <Form.Item label={'链码ID'}>
                        <Input disabled placeholder={invokeReq.chaincodeID}/>
                    </Form.Item>

                    <Form.Item label={'Peer节点URL'}>
                        <Select
                            mode='tags'
                            onChange={setInvokeReqByKey('peerURLs')}
                        >
                            {
                                channel.organizations
                                    .flatMap(org => org.peers)
                                    .map(({ nickname: url }) => <Select.Option value={url}>{url}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item label={'参数'}>
                        <Select
                            mode="tags"
                            onChange={setInvokeReqByKey('args')}
                            tokenSeparators={[' ']}
                            dropdownStyle={{ display: 'none' }}
                        />
                    </Form.Item>

                    <Form.Item label={'调用类型'}>
                        <Select onChange={setInvokeReqByKey('invokeType')}>
                            <Select.Option value={'init'}>{'init'}</Select.Option>
                            <Select.Option value={'query'}>{'query'}</Select.Option>
                            <Select.Option value={'execute'}>{'execute'}</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label={'用户ID'}>
                        <Select onChange={setInvokeReqByKey('userID')}>
                            {
                                channel.organizations
                                    .flatMap(({ users }) => users)
                                    .map(({ id: userID, nickname }) => <Select.Option value={userID}>{`${userID} - ${nickname}`}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <ModelDetailModal
                model={models.chaincode}
                visible={modalVisible}
                record={modalRecord}
                onCancel={() => setModalVisible(false)}
            />
        </>
    );
};

export default ChaincodePage;
