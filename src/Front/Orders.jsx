import React, { useState } from 'react';

function Orders() {
  // ตัวอย่างข้อมูลคำสั่งซื้อ
  const [orders] = useState([
    {
      id: 1,
      table: 'โต๊ะที่ 1',
      items: [
        { name: 'มอคค่า', quantity: 1, price: 50 },
        { name: 'ลาเต้', quantity: 1, price: 55 },
        { name: 'เอสเปรสโซ', quantity: 1, price: 45 },
        { name: 'อเมริกาโนน้ำส้ม', quantity: 1, price: 50 },
      ],
    },
    {
      id: 2,
      table: 'โต๊ะที่ 2',
      items: [
        { name: 'คาปูชิโน', quantity: 1, price: 65 },
        { name: 'มาคิอาโต้', quantity: 1, price: 55 },
        { name: 'คาปูชิโน', quantity: 1, price: 65 },

      ],
    },
    {
      id: 2,
      table: 'โต๊ะที่ 3',
      items: [
        { name: 'มาคิอาโต้', quantity: 1, price: 55 },
        { name: 'คาราเมลมาคิอาโต้', quantity: 2, price: 40 },
        { name: 'อเมริกาโน', quantity: 1, price: 45 },
      ],
    },
    {
      id: 2,
      table: 'โต๊ะที่ 4',
      items: [
        { name: 'เอสเปรสโซ', quantity: 2, price: 75 },
        { name: 'ลาเต้', quantity: 2, price: 45 },
       
      ],
    },
    
  ])
  

  const [selectedOrder, setSelectedOrder] = useState(null); // ใช้สำหรับเปิดป๊อปอัป

  // คำนวณราคาสินค้ารวม
  const calculateTotal = (items) =>
    items.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div className="p-6">
      <h2 className="text-center text-2xl font-bold mb-4">คำสั่งซื้อ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 shadow-md rounded-lg flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold text-lg mb-2">{order.table}</h3>
              <p>จำนวนสินค้า: {order.items.length}</p>
              <p>ราคารวม: {calculateTotal(order.items)} บาท</p>
            </div>
            <button
              onClick={() => setSelectedOrder(order)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              ดูรายละเอียด
            </button>
          </div>
        ))}
      </div>

      {/* ป๊อปอัปแสดงรายละเอียด */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h3 className="text-xl font-bold mb-4">รายละเอียดคำสั่งซื้อ</h3>
            <p className="mb-2">โต๊ะ: {selectedOrder.table}</p>
            <ul className="mb-4">
              {selectedOrder.items.map((item, index) => (
                <li key={index} className="flex justify-between border-b py-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{item.price * item.quantity} บาท</span>
                </li>
              ))}
            </ul>
            <p className="font-bold">ราคารวม: {calculateTotal(selectedOrder.items)} บาท</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => window.print()}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                พิมพ์ใบเสร็จ
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
