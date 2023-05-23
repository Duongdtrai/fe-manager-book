import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Space, Table, Image, Button, Popconfirm, Input, notification } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import Pagination from "../../../../components/Pagination";
import { useDocumentTitle } from "../../../../hooks/useDocumentTitle";
import { API } from "../../../../configs";
import BookDefault from "../../../../assets/images/bookDefault.png";
import moment from 'moment';
import { DATE_FORMAT_YEAR } from '../../../../utils/constant';
const { Search } = Input;


const ListCategory = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [freeWord, setFreeWord] = useState("");
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [confirmStates, setConfirmStates] = useState([]);
  const history = useHistory();
  useDocumentTitle("Danh sách category");

  useEffect(() => {
    setLoading(true);
    API.getAllCategoryCMS(page, size, freeWord).then(response => {
      setListCategory(response?.data?.data.rows);
      setTotal(response?.data?.data.count);
      setLoading(false);
    }).catch(() => {
      notification["error"]({
        message: "Lấy danh sách category không thành công",
      });
    }).finally(() => {
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
          src={record?.avatar_category?.image || BookDefault}
          style={{ objectFit: 'contain' }}
          preview={{ mask: <EyeOutlined className='!text-lg' /> }}
        />
      </div>
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => record.title || "-",
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record) => moment(record.createdAt).format(DATE_FORMAT_YEAR),
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_, record) => record.updatedAt === record.createdAt ? "-" : moment(record.updatedAt).format(DATE_FORMAT_YEAR),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div>
          <Space size="middle">
            <Button type="primary" onClick={() => history.push(`/admin/list-category/${record.id}`)}>Chi tiết</Button>
            <Popconfirm
              title="Xóa danh mục"
              description="Bạn có muốn xóa danh mục không?"
              okText="Yes"
              cancelText="No"
              open={confirmStates[record.id]}
              okButtonProps={{
                loading: loading,
              }}
              onConfirm={() => handleDeleteCategory(record.id)}
              onCancel={() => setConfirmStates(confirmStates => ({...confirmStates, [record.id]: false}))}
            >
              <Button type="primary" danger onClick={() => setConfirmStates(confirmStates => ({...confirmStates, [record.id]: true}))}>Xóa</Button>
            </Popconfirm>
          </Space>
        </div>

      ),
    },
  ];

  const handleDeleteCategory = (categoryId) => {
    setLoading(true);
    API.deleteCategory(categoryId).then(() => {
      notification["success"]({
        message: "Xóa category thành công",
      });
      setRefresh(!refresh);
    }).catch(() => {
      notification["error"]({
        message: "Xóa category không thành công",
      });
    }).finally(()=> {
      setLoading(false);
    });
  };

  const handleTableChange = (page, size) => {
    setPage(page);
    setSize(size);
    setRefresh(!refresh);
  };

  const onSearchCategory = (value) => {
    setFreeWord(value);
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1 className="text-3xl">Danh sách Danh Mục</h1>
      <Space className='mb-4'>
        <Search
          placeholder="Tìm kiếm danh mục"
          allowClear
          enterButton="Search"
          onSearch={onSearchCategory}
        />
        <Button
          type="primary"
          onClick={() => history.push("/admin/create-category")}
        >Thêm category
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={listCategory}
        pagination={false}
        loading={loading}
      />
      <Pagination total={total} current={page} handleTableChange={handleTableChange} />
    </div>
  );
};
export default ListCategory;