import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function DailyMenu() {
  const [salesData, setSalesData] = useState({
    dailySales: {},
    monthlySales: 0,
    yearlySales: 0,
    totalItemsSold: 0,
  });
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchOrders();
    socket.on("update_orders", (newOrders) => {
      processSalesData(newOrders);
    });
    return () => socket.off("update_orders");
  }, []);

  const fetchOrders = () => {
    axios.get('http://localhost:5000/orders')
      .then(response => {
        if (response.data) {
          processSalesData(response.data);
        }
      })
      .catch(error => console.error("Error fetching orders:", error));
  };

  const processSalesData = (orders) => {
    const dailySales = {};
    let monthlySales = 0;
    let yearlySales = 0;
    let totalItemsSold = 0;

    orders.forEach(order => {
      const orderDate = new Date(order.date);
      const dateKey = orderDate.toISOString().split("T")[0];
      const items = JSON.parse(order.items);
      if (!dailySales[dateKey]) dailySales[dateKey] = { total: 0, items: [] };

      items.forEach(item => {
        totalItemsSold += item.quantity;
        dailySales[dateKey].total += item.price * item.quantity;
        dailySales[dateKey].items.push(item);
      });

      monthlySales += order.total_amount;
      yearlySales += order.total_amount;
    });

    setSalesData({ dailySales, monthlySales, yearlySales, totalItemsSold });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-200 to-purple-300 min-h-screen">
      <h2 className="text-5xl font-extrabold text-center text-purple-900 mb-12 drop-shadow-lg">📊 สรุปยอดขาย</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12">
        <div className="bg-yellow-500 text-white p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold">📅 ยอดขายรายปี</h3>
          <p className="text-3xl font-bold mt-4">{salesData.yearlySales.toLocaleString()} บาท</p>
          <p className="text-lg">📆 {new Date().getFullYear()}</p>
        </div>

        <div className="bg-green-500 text-white p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold">📆 ยอดขายรายเดือน</h3>
          <p className="text-3xl font-bold mt-4">{salesData.monthlySales.toLocaleString()} บาท</p>
          <p className="text-lg">📆 {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <h3 className="text-3xl font-semibold text-purple-800 mb-6 text-center">📅 ยอดขายรายวัน</h3>
        <div className="overflow-hidden border border-gray-300 rounded-lg shadow-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-blue-500 text-white text-lg">
                <th className="py-4 px-6">วันที่</th>
                <th className="py-4 px-6">ยอดขาย (บาท)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {Object.entries(salesData.dailySales).map(([date, data]) => (
                <tr 
                  key={date} 
                  className="hover:bg-gradient-to-r from-blue-100 to-purple-200 cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedDate(date)}
                >
                  <td className="py-4 px-6 text-center text-gray-700 font-medium">{date}</td>
                  <td className="py-4 px-6 text-center text-gray-800 font-bold">{data.total.toLocaleString()} บาท</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gradient-to-br from-blue-100 to-purple-200 p-8 rounded-3xl shadow-2xl w-11/12 max-w-lg">
            <h3 className="text-3xl font-bold mb-4 text-purple-800">📅 รายละเอียดยอดขาย {selectedDate}</h3>
            <ul className="space-y-3">
              {salesData.dailySales[selectedDate].items.map((item, index) => (
                <li key={index} className="flex justify-between bg-white p-3 rounded-xl shadow-sm">
                  <span className="text-purple-700 font-semibold">{item.name} x {item.quantity}</span>
                  <span className="text-blue-800 font-bold">{(item.price * item.quantity).toLocaleString()} บาท</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-5">
              <button 
                onClick={() => setSelectedDate(null)}
                className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 transition-all duration-300"
              >
                ❌ ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyMenu;