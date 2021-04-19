import {Table} from "antd";
import {useEffect, useState} from "react";
import {refreshDataSource} from "../../MenuLayout/MenuLayout";

const NetworkDetailTable = ({ columns, dataSourceAsync, initialDataSource }) => {
    const [ tableLoading, setTableLoading ] = useState(true);
    const [ dataSource, setDataSource ] = useState([]);

    const refreshAsync = async () =>
        refreshDataSource(dataSourceAsync, setDataSource)
            .then(() => setTableLoading(false));

    useEffect(() => {
        if (initialDataSource) {
            setDataSource(initialDataSource);
            setTableLoading(false);
        } else {
            refreshAsync();
        }
    }, []);

    return (
        <Table
            loading={tableLoading}
            columns={columns}
            rowKey={'id'}
            dataSource={dataSource}
            pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
            }}
        />
    )
};

export default NetworkDetailTable;
