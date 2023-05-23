import React, { useEffect, useState } from 'react';
import { Space, Table, Image, notification, Input, Tag, Select } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import Pagination from "../../../components/Pagination";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { API } from "../../../configs";
import { STATUS_CARTS, ARR_CART_STATUS } from "../../../utils/constant";
const { Search } = Input;
import BookDefault from "../../../assets/images/bookDefault.png";

const ListCart = () => {
  useDocumentTitle('Danh sách giỏ hàng');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [freeWord, setFreeWord] = useState("");
  const [listCart, setListCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.getAllCartAdmin(page, size, freeWord).then(response => {
      setListCart(response?.data?.data?.rows);
      setTotal(response?.data.data.count);
    }).catch(() => {
      notification["error"]({
        message: "Lấy thông tin giỏ hàng không thành công",
      });
    }).finally(() => {
      setLoading(false);
      console.clear();
    });
  }, [refresh]);

  const columns = [
    {
      title: 'Ảnh sách',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => <div>
        <Image
          width={70}
          height={70}
          src={record?.book?.avatar_book?.image || BookDefault}
          style={{ objectFit: 'contain' }}
          fallback={BookDefault}
          preview={{ mask: <EyeOutlined className='!text-lg' /> }}
        />
      </div>
    },
    {
      title: 'Tên sách',
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => record?.book?.title || '-'
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'email',
      key: 'email',
      render: (_, record, index) => <div key={index}>{record?.fullName || record?.cart?.userName}</div>
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'numberPhone',
      key: 'numberPhone',
      render: (_, record) => record?.numberPhone || '-'
    },
    {
      title: 'Số lượng',
      dataIndex: 'age',
      key: 'age',
      render: (_, record) => record?.quantity || '-'
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>
        <Tag
          key={status}
          color={STATUS_CARTS[status].color}
          className='py-2'
        >
          {STATUS_CARTS[status].message}
        </Tag>
    },
    {
      title: 'Hoạt động',
      key: 'action',
      render: (_, record, index) => (
        <Select
          onChange={(value) => handleChangeStatus(record, value)}
          key={index}
          value={record.status}
          options={ARR_CART_STATUS}
        />
      ),
    },
  ];
  const handleChangeStatus = (record, status) => {
    API.editCart(record.id, { status }).then(() => {
      notification["success"]({
        message: "Cập nhật giỏ hàng thành công",
      });
      setRefresh(!refresh);
    }).catch(() => {
      notification["error"]({
        message: "Cập nhật giỏ hàng không thành công",
      });
    });
  };
  const handleTableChange = (page, size) => {
    setPage(page);
    setSize(size);
    setRefresh(!refresh);
  };

  const onSearchAuthor = (value) => {
    setFreeWord(value);
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1 className="text-3xl">Danh sách giỏ hàng của người dùng</h1>
      <Space className='mb-4'>
        <Search
          placeholder="Tìm kiếm giỏ hàng"
          allowClear
          enterButton="Search"
          onSearch={onSearchAuthor}
        />
      </Space>
      <Table columns={columns} dataSource={listCart} pagination={false} loading={loading} />
      <Pagination total={total} current={page} handleTableChange={handleTableChange} />
    </div>
  );
};
export default ListCart;