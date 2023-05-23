import React, { useState, useEffect } from 'react';
import { Space, Table, Image, Button, notification, Popconfirm, Input } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import Pagination from "../../../../components/Pagination";
import { useDocumentTitle } from "../../../../hooks/useDocumentTitle";
import { useHistory } from 'react-router-dom';
import { API } from "../../../../configs";
import UserDefault from "../../../../assets/images/user-default.png";
import moment from 'moment';
import { DATE_FORMAT_YEAR } from '../../../../utils/constant';
const { Search } = Input;

const ListAuthor = () => {
  useDocumentTitle('Danh sách tác giả');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [freeWord, setFreeWord] = useState("");
  const [listAuthor, setListAuthor] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [confirmStates, setConfirmStates] = useState([]);
  const [total, setTotal] = useState(0);

  const history = useHistory();
  useEffect(() => {
    setLoading(true);
    API.getAllAuthorCMS(page, size, freeWord).then(response => {
      setListAuthor(response?.data.data.rows);
      setTotal(response?.data.data.count);
    }).catch(() => {
      notification["error"]({
        message: "Lấy danh sách tác giả không thành công",
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
      render: (_, record) => 
        <Image
          width={70}
          height={70}
          src={record.avatar.image || UserDefault}
          style={{ objectFit: 'contain' }}
          preview={{ mask: <EyeOutlined className='!text-lg' /> }}
        />
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_, record) => record.fullName || '-'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'age',
      key: 'age',
      render: (_, record) => moment(record.birthday).format(DATE_FORMAT_YEAR) || '-'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (_, record) => record.gender || '-'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => record.address || '-'
    },

    {
      title: 'Hành động',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => history.push(`/admin/list-author/${record.id}`)}>Chi tiết</Button>
          <Popconfirm
            title="Xóa tác giả"
            description="Bạn có muốn xóa tác giả không?"
            okText="Yes"
            cancelText="No"
            open={confirmStates[record.id]}
            okButtonProps={{
              loading: loading,
            }}
            onConfirm={() => handleDeleteAuthor(record.id)}
            onCancel={() => setConfirmStates(confirmStates => ({ ...confirmStates, [record.id]: false }))}
          >
            <Button type="primary" danger onClick={() => setConfirmStates(confirmStates => ({ ...confirmStates, [record.id]: true }))}>Xóa</Button>
          </Popconfirm>

        </Space>
      ),
    },
  ];

  const handleDeleteAuthor = (authorId) => {
    setLoading(true);
    API.deleteAuthor(authorId).then(() => {
      notification["success"]({
        message: "Xóa tác giả thành công",
      });
      setRefresh(!refresh);
    }).catch(() => {
      notification["error"]({
        message: "Xóa tác giả không thành công",
      });
    }).finally(() => {
      setLoading(true);
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
      <h1 className="text-3xl">Danh sách tác giả</h1>
      <Space className='mb-4'>
        <Search
          placeholder="Tìm kiếm tác giả"
          allowClear
          enterButton="Search"
          onSearch={onSearchAuthor}
        />
        <Button type="primary" onClick={() => history.push("/admin/create-author")}>Thêm tác giả</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={listAuthor}
        pagination={false}
        loading={loading}
      />
      <Pagination total={total} current={page} handleTableChange={handleTableChange} />
    </div>
  );
};
export default ListAuthor;