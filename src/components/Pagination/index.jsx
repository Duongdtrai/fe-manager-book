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
    <div style={{ alignItems: 'end', display: 'flex', flexDirection: 'column', padding: '10px' }}>
      <Pagination
        size="small"
        style={{ marginTop: '16px' }}
        total={totalPage}
        showTotal={(total) => `Total ${total} items`}
        showSizeChanger
        showQuickJumper
        onChange={(page, size) => {
          handleTableChange(page, size);
        }}
        current={currentPage}
      />
    </div>
  );
};

export default memo(PaginationCustom);
