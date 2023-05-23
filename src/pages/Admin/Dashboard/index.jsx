import React from 'react';
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const Dashboard = () => {
  useDocumentTitle('Dashboard');
  return (
    <div>
      <h1 className='text-3xl text-center'>Chào mừng ông chủ đến với Hệ Thống Quản Lý Thư Viện Sách❤️</h1>
    </div>
  );
};

export default Dashboard;