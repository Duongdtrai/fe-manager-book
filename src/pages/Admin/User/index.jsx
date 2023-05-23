import React, { useEffect, useState } from 'react';
import { Space, Table, Image, Button, notification, Input } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import Pagination from "../../../components/Pagination";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { API } from "../../../configs";
import UserDefault from "../../../assets/images/user-default.png";
const { Search } = Input;

const ListUser = () => {
  useDocumentTitle('Danh sách độc giả');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [freeWord, setFreeWord] = useState("");
  const [listUser, setListUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    API.getAllUser(page, size, freeWord).then(response => {
      setListUser(response?.data?.data?.rows);
      setTotal(response?.data.data.count);
    }).catch(() => {
      notification["error"]({
        message: "Lấy danh sách người dùng không thành công",
      });
    }).finally(() => {
      setLoading(false);
      console.clear();
    });
  }, [refresh]);
  
  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => <div> 
        <Image
          width={70}
          height={70}
          src={record?.avatar_user?.image || UserDefault}
          style={{objectFit: 'contain'}}
          fallback={UserDefault}
          preview={{ mask: <EyeOutlined className='!text-lg' /> }}
        />
      </div> 
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => record.email ? record.email : '-'
    },
    {
      title: 'Họ tên',
      dataIndex: 'userName',
      key: 'userName',
      render: (_, record) => record.userName ? record.userName : '-'
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
      render: (_, record) => record.age ? record.age : '-'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (_, record) => record.gender ? record.gender : '-'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => record.address ? record.address : '-'
    },
  ];

  const handleTableChange = (page, size) => {
    setPage(page);
    setSize(size);
    setRefresh(!refresh);
  };
  
  const onSearchUser = (value) => {
    setFreeWord(value);
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1 className="text-3xl">Danh sách thông tin người dùng</h1>
      <Space className='mb-4'>
        <Search
          placeholder="Tìm kiếm user"
          allowClear
          enterButton="Search"
          onSearch={onSearchUser}
        />
      </Space>
      <Table columns={columns} dataSource={listUser} pagination={false} loading={loading} />
      <Pagination total={total} current={page} handleTableChange={handleTableChange} />
    </div>
  );
};
export default ListUser;