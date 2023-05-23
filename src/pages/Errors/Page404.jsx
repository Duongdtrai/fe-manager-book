import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Result } from 'antd';

const ErrorPage = () => {
  const history = useHistory();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary" onClick={() => history.push("/")}>Trang chủ</Button>}
    />
  );
};

export default ErrorPage;
