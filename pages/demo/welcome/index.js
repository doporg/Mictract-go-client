import React from 'react';
import MenuLayout from "components/MenuLayout/MenuLayout";

export default class Index extends React.Component {
    render() {
        return (
            <MenuLayout>
                <div style={{background: "#fff"}}>
                    <h1> Welcome ! </h1>
                </div>
            </MenuLayout>
        )
    }
}
