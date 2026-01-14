import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        {/* User */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl mb-2">
            😊
          </div>
          <span className="font-semibold">Name</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <button className="text-left px-4 py-2 rounded hover:bg-gray-200">Dashboard</button>
          <button className="text-left px-4 py-2 rounded hover:bg-gray-200">Income</button>
          <button className="text-left px-4 py-2 rounded hover:bg-gray-200">Expense</button>
          <button className="text-left px-4 py-2 rounded hover:bg-gray-200 font-semibold bg-gray-200">Cash-Flow Forecast</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <h1 className="text-xl font-bold mb-4">Cash Flow Monitor</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-sm text-gray-500">Total Balance</p>
            <p className="text-lg font-bold">$1000</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-sm text-gray-500">Income</p>
            <p className="text-lg font-bold">$2000</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-lg font-bold">$700</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-sm text-gray-500">Net Monthly Change</p>
            <p className="text-lg font-bold text-green-600">+$1300 / -300</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white h-96 rounded shadow flex items-center justify-center text-gray-400 font-bold">
            Cash Flow Forecast Chart
          </div>
          <div className="bg-white h-96 rounded shadow flex items-center justify-center text-gray-400 font-bold">
            Cash Flow Forecast Chart
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
