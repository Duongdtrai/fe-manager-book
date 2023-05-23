import React from "react";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 50,
    }}
    spin
  />
);
const LoadingComponent = () => {
  return (
    <div className="fixed h-full w-full flex justify-center items-center">
      <Spin indicator={antIcon} className="fixed top-1/2 right-1/2" />
    </div>
  );
};
export default LoadingComponent;