import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // อัปเดตทุก 5 วินาที
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/orders');
      if (response.data) {
        const pendingOrders = response.data.filter(order => order.payment_status !== 'paid');
        setOrders(pendingOrders);
      }
      setLoading(false);
    } catch (error) {
      setError('ไม่สามารถโหลดคำสั่งซื้อได้');
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    try {
      const parsedItems = JSON.parse(items);
      return parsedItems.reduce((total, item) => total + item.quantity * item.price, 0);
    } catch (error) {
      return 0;
    }
  };

  const handlePayment = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}/payment`);
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-600">⏳ กำลังโหลดข้อมูล...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-8 bg-gradient-to-br from-blue-200 to-purple-300 min-h-screen">
      <h2 className="text-center text-5xl font-extrabold text-purple-900 mb-8 drop-shadow-lg">📜 คำสั่งซื้อ</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 shadow-2xl rounded-3xl flex flex-col justify-between transform transition hover:scale-105 hover:shadow-2xl border border-gray-200 relative overflow-hidden"
          >
            <div className="text-center">
              <h3 className="font-extrabold text-2xl mb-2 text-gray-800">โต๊ะที่: {order.table_number}</h3>
              <p className="text-gray-600 text-lg font-semibold">💰 ราคารวม: <span className="text-green-600">{calculateTotal(order.items)} บาท</span></p>
            </div>
            <button
              onClick={() => setSelectedOrder(order)}
              className="mt-4 bg-purple-700 text-white py-3 px-6 rounded-full hover:bg-purple-800 transition duration-300 shadow-lg mx-auto w-full"
            >
              🔍 ดูรายละเอียด
            </button>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => setSelectedOrder(null)}
            >✖</button>
            <h3 className="text-3xl font-bold text-center text-purple-800 mb-6">📦 รายละเอียดคำสั่งซื้อ</h3>
            <p className="mb-2 text-gray-700">📍 โต๊ะที่: <span className="font-bold text-blue-600">{selectedOrder.table_number}</span></p>
            <ul className="mb-4 space-y-4">
              {JSON.parse(selectedOrder.items).map((item, index) => (
                <li key={index} className="flex items-center border-b pb-3">
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-300"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">{item.name} x {item.quantity}</p>
                    <p className="text-gray-600">💵 {item.price * item.quantity} บาท</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="font-bold text-gray-800 text-lg">💰 ราคารวม: <span className="text-green-600">{calculateTotal(selectedOrder.items)} บาท</span></p>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => handlePayment(selectedOrder.id)}
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg"
              >💳 จ่ายเงินแล้ว</button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg"
              >❌ ปิด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
