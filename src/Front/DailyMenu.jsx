import React, { useState, useEffect } from 'react';

function DailyMenu() {
  // ตัวอย่างข้อมูลยอดขาย (สามารถปรับปรุงให้ดึงข้อมูลจาก API หรือฐานข้อมูลจริง)
  const [salesData, setSalesData] = useState({
    dailySales: 0,
    monthlySales: 0,
    yearlySales: 0,
    totalItemsSold: 0,
  });

  const sales = [
    { date: '2024-12-10', amount: 500, itemsSold: 10 },
    { date: '2024-12-09', amount: 300, itemsSold: 6 },
    { date: '2024-12-08', amount: 700, itemsSold: 14 },
    // เพิ่มข้อมูลการขายอื่นๆ
  ];

  const calculateSales = () => {
    const today = new Date();
    let daily = 0;
    let monthly = 0;
    let yearly = 0;
    let totalItems = 0;

    sales.forEach((sale) => {
      const saleDate = new Date(sale.date);
      if (saleDate.toDateString() === today.toDateString()) {
        daily += sale.amount;
      }
      if (saleDate.getMonth() === today.getMonth() && saleDate.getFullYear() === today.getFullYear()) {
        monthly += sale.amount;
      }
      if (saleDate.getFullYear() === today.getFullYear()) {
        yearly += sale.amount;
      }
      totalItems += sale.itemsSold;
    });

    setSalesData({
      dailySales: daily,
      monthlySales: monthly,
      yearlySales: yearly,
      totalItemsSold: totalItems,
    });
  };

  useEffect(() => {
    calculateSales();
  }, [sales]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">แดชบอร์ดยอดขาย</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* แสดงยอดขายรายวัน */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <h3 className="text-xl font-semibold">ยอดขายรายวัน</h3>
          <p className="text-2xl font-bold mt-4">{salesData.dailySales} บาท</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <p>จำนวนการขาย: {salesData.totalItemsSold} รายการ</p>
            <p>วันนี้ {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* แสดงยอดขายรายเดือน */}
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <h3 className="text-xl font-semibold">ยอดขายรายเดือน</h3>
          <p className="text-2xl font-bold mt-4">{salesData.monthlySales} บาท</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <p>จำนวนการขาย: {salesData.totalItemsSold} รายการ</p>
            <p>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* แสดงยอดขายรายปี */}
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <h3 className="text-xl font-semibold">ยอดขายรายปี</h3>
          <p className="text-2xl font-bold mt-4">{salesData.yearlySales} บาท</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <p>จำนวนการขาย: {salesData.totalItemsSold} รายการ</p>
            <p>{new Date().getFullYear()}</p>
          </div>
        </div>

        {/* แสดงข้อมูลสรุปทั้งหมด */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <h3 className="text-xl font-semibold">สรุปยอดขายทั้งหมด</h3>
          <p className="text-2xl font-bold mt-4">{salesData.dailySales + salesData.monthlySales + salesData.yearlySales} บาท</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <p>จำนวนการขายทั้งหมด: {salesData.totalItemsSold} รายการ</p>
            <p>ยอดขายรวม</p>
          </div>
        </div>
      </div>

      {/* เพิ่มเนื้อหาของเมนูที่ขายในวันนี้ */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl mb-4">เมนูที่ขายในวันนี้:</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>มอคค่า</span>
            <span>50 บาท</span>
          </li>
          <li className="flex justify-between">
            <span>ลาเต้</span>
            <span>70 บาท</span>
          </li>
          <li className="flex justify-between">
            <span>คาปูชิโน</span>
            <span>100 บาท</span>
          </li>
          <li className="flex justify-between">
            <span>อเมริกาโน</span>
            <span>120 บาท</span>
          </li>
          {/* เพิ่มเมนูอื่นๆ */}
        </ul>
      </div>
    </div>
  );
}

export default DailyMenu;
