import api from "api";
import {interactWithMessage} from "../../components/MenuLayout/MenuLayout";
import {modelColumns, models} from "api/model";
import {Button, Col, Descriptions, Modal, PageHeader, Tabs} from "antd";
import {Subject} from "rxjs";
import ModelPage from "components/ModelPage/ModelPage";
import {useState} from "react";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import ComponentLoader from "../../components/ComponentLoader/ComponentLoader";
import ModelDetailModal from "../../components/ModelDetailModal/ModelDetailModal";

const ChaincodeTransactionPage = () => {
    const [ selectedTransactions, setSelectedTransactions ] = useState([]);

    const refresh$ = new Subject();
    const handleDeleteChaincodeTransaction = async id => {
        await interactWithMessage(
            () => api.deleteChaincodeTransaction({ids: [id]}),
            'delete chaincode transaction',
        )();
        refresh$.next();
    };

    const handleDeleteSelectedChaincodeTransactions = () => Modal.confirm({
        title: '确定要删除选择的记录？',
        icon: <ExclamationCircleOutlined />,
        content: '删除的记录不可恢复',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
            await interactWithMessage(
                () => api.deleteChaincodeTransaction({ids: selectedTransactions}),
                'delete chaincode transaction',
            )();
            refresh$.next();
        },
    });

    // ========== presentation networks ==========
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ modalRecord, setModalRecord ] = useState({});
    const handleShowDetailModal = record => {
        setModalVisible(true);
        setModalRecord(record);
    };

    const columns = [...modelColumns.chaincodeTransaction];
    columns.push({
        key: 'actions',
        dataIndex: 'actions',
        title: '操作',
        render: (_, record) => {
            return (
                <Button.Group key={record.id}>
                    <Button onClick={() => handleShowDetailModal(record)}>更多</Button>
                    <Button onClick={() => handleDeleteChaincodeTransaction(record.id)} danger>删除</Button>
                </Button.Group>
            );
        }
    })

    return (
        <>
            <ModelPage
                columns={columns}
                dataSourceAsync={api.listChaincodeTransactions}

                refreshEnabled
                refreshSubject={refresh$}

                extra={
                    <Button
                        type="primary"
                        danger
                        onClick={handleDeleteSelectedChaincodeTransactions}
                        icon={<DeleteOutlined />}
                    >
                        {'删除已选'}
                    </Button>
                }
                rowSelection={{
                    selectedRowKeys: selectedTransactions,
                    onChange: setSelectedTransactions,
                }}
            />

            <ModelDetailModal
                model={models.chaincodeTransaction}
                visible={modalVisible}
                record={modalRecord}
                onCancel={() => setModalVisible(false)}
            />
        </>
    );
};

export default ChaincodeTransactionPage;
