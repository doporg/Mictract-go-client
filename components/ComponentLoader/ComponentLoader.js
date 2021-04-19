import {Spin} from "antd";

const ComponentLoader = ({ children, isLoading }) => isLoading ?
    <Spin tip={'加载中...'}> { children } </Spin> :
    children;

export default ComponentLoader;
