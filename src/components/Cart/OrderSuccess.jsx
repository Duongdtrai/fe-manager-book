/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Image, Table, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { DATE_TIME, STATUS_CARTS } from '../../utils/constant';
import moment from 'moment';

const OrderSuccess = (props) => {
  const [listCartSuccess, setListCartSuccess] = useState([]);

  useEffect(() => {
    setListCartSuccess(props.cartSuccess);
  }, [props]);

  const columns = [
    {
      title: 'Ảnh sách',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (_, record) =>
        <Image
          width={150}
          height={150}
          src={record?.book?.avatar_book?.image}
          className='object-contain'
          preview={{ mask: <EyeOutlined className='!text-lg' /> }}
        />
    },
    {
      title: 'Tên sách',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => record?.book?.title
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) =>
        <Tag color={STATUS_CARTS[record?.status].color} key={record.id} className='py-1'>
          {STATUS_CARTS[record?.status].message}
        </Tag>
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format(DATE_TIME),
    },
  ];

  return (
    <div className='mt-6'>
      <Table
        columns={columns}
        dataSource={listCartSuccess}
        pagination={false}
      />
    </div>
  );
};

export default OrderSuccess;