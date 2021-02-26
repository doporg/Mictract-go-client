import React from 'react';
import {Calendar} from "antd";
import style from './Deme.less';
import MenuLayout from "components/MenuLayout/MenuLayout";

export default class Index extends React.Component {
    render() {
        return (
            <MenuLayout>
                <div className={style.siteCalendarDemoCard}>
                    <h1 className={style.testing}>Testing!</h1>
                    <h1 className={style.testing2}>Testing!</h1>
                    <Calendar fullscreen={false} />
                </div>
            </MenuLayout>
        );
    }
}
