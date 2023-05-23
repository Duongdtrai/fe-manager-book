import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Space, Table, Image, Button, Popconfirm, Input, notification } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import Pagination from "../../../../components/Pagination";
import { useDocumentTitle } from "../../../../hooks/useDocumentTitle";
import { API } from "../../../../configs";
import BookDefault from "../../../../assets/images/bookDefault.png";
const { Search } = Input;

const ListBook = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [freeWord, setFreeWord] = useState("");
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listBook, setListBook] = useState([]);
  const history = useHistory();
  useDocumentTitle("Danh sách Book");
  useEffect(() => {
    setLoading(true);
    API.getAllBookCMS(page, size, freeWord).then(response => {
      setListBook(response.data.data.rows);
      setTotal(response.data.data.count);
      setLoading(false);
    }).catch(() => {
      notification["error"]({
        message: "Lấy danh sách Book không thành công",
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
          src={record?.avatar_book?.image || BookDefault}
          style={{ objectFit: 'contain' }}
          preview={{ mask: <EyeOutlined className='!text-lg' /> }}
        />
      </div>
    },
    {
      title: 'Tên sách',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => record.title || "-",
    },
    {
      title: 'Danh mục',
      dataIndex: 'category_book',
      key: 'category_book',
      render: (_, record) => record?.category_book.title || "-",
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (_, record) =>
        <div style={{
          maxWidth: 200,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {record.description || "-"}
        </div>
    },
    {
      title: 'Tác giả',
      dataIndex: 'author_book',
      key: 'author_book',
      render: (_, record) => record?.author_book?.fullName || "-",
    },
    {
      title: 'Số lượng trang',
      dataIndex: 'numberPage',
      key: 'numberPage',
      render: (_, record) => <div>{record.numberPage}</div>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => <div>{record.price.toLocaleString('vi-VN', { style: 'currency', currency: 'vnd' })}</div>,
    },
    {
      title: 'Ngày phát hành',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      render: (_, record) => {
        const timestamp = record.releaseDate;
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return (
          <div>{`${day}/${month}/${year}`}</div>
        );
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div>
          <Space size="middle">
            <Button type="primary" onClick={() => history.push(`/admin/list-book/${record.id}`)}>Chi tiết</Button>
            <Popconfirm
              title="Xóa sách"
              description="Bạn có muốn xóa sách không?"
              okButtonProps={{ loading: loading }}
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDeleteBook(record.id)}
            >
              <Button type="primary" danger >Xóa</Button>
            </Popconfirm>
          </Space>
        </div>

      ),
    },
  ];
  const handleDeleteBook = (bookId) => {
    setLoading(true);
    API.deleteBook(bookId).then(() => {
      notification["success"]({
        message: "Xóa book thành công",
      });
      setRefresh(!refresh);
    }).catch(() => {
      notification["error"]({
        message: "Xóa book không thành công",
      });
    }).finally(() => {
      setLoading(false);
    });
  };
  const handleTableChange = (page, size) => {
    setPage(page);
    setSize(size);
    setRefresh(!refresh);
  };

  const onSearchBook = (value) => {
    setFreeWord(value);
    setRefresh(!refresh);
  };
  return (
    <div>
      <h1 className="text-3xl">Quản lý toàn bộ sách</h1>
      <Space className='mb-4'>
        <Search
          placeholder="Tìm kiếm tác giả"
          allowClear
          enterButton="Search"
          onSearch={onSearchBook}
        />
        <Button type="primary" onClick={() => history.push("/admin/create-book")}>Thêm mới sách</Button>
      </Space>
    
      <Table columns={columns} dataSource={listBook} pagination={false} loading={loading} />
      <Pagination total={total} current={page} handleTableChange={handleTableChange} />
    </div>
  );
};
export default ListBook;