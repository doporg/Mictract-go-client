import {Table} from "antd";
import {useEffect, useState} from "react";
import {handleErrorWithMessage} from "../../MenuLayout/MenuLayout";
import {Subject} from "rxjs";

const NetworkDetailTable = ({ columns, dataSourceAsync }) => {
    const [ tableLoading, setTableLoading ] = useState(true);
    const [ dataSource, setDataSource ] = useState([]);

    const refreshAsync = async () => {
        try {
            const { data: {payload: dataSource} } = await dataSourceAsync();
            setDataSource(dataSource);

            if (tableLoading)
                setTableLoading(false);
        } catch (e) {
            handleErrorWithMessage(e, {
                message: 'refreshing',
            });
        }
    };
    useEffect(() => {
        refreshAsync()
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
