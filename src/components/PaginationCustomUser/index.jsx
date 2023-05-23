import React, { useState, useEffect, memo } from "react";
import { Pagination } from "antd";

const PaginationCustom = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  // eslint-disable-next-line react/prop-types
  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    setTotalPage(props.total);
    // eslint-disable-next-line react/prop-types
    setCurrentPage(props.current);
    // eslint-disable-next-line react/prop-types
  }, [props.current, props.total]);

  const handleTableChange = (page, size) => {
    // eslint-disable-next-line react/prop-types
    props.handleTableChange(page, size);
  };

  return (
    <div className="flex items-center justify-center flex-col p-3">
      <Pagination
        size="large"
        style={{ marginTop: '16px' }}
        total={totalPage}
        showTotal={false}
        showSizeChanger = {false}
        showQuickJumper = {false}
        onChange={(page, size) => {
          handleTableChange(page, size);
        }}
        current={currentPage}
      />
    </div>
  );
};

export default memo(PaginationCustom);
