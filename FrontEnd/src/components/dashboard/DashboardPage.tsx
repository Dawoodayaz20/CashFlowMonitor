import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import dashboard from '../../assets/dashboard.png';
import income from '../../assets/salary.png';
import expense from '../../assets/spending.png';
import forecast from '../../assets/forecast.png';
import settings from '../../assets/settings.png';
import profile from '../../assets/profile.png';
import AreaChartComp from "./AreaChart";
import { useNavigate } from "react-router-dom";
import { SignOut } from "../authentication/authMethods";
import AddTransactionModal from "../transactionModal/addTransaction";


const Dashboard: React.FC = () => {
  
  const [navbarOpen, setnavbarOpen] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  const navigate = useNavigate();

  const handleTransactionSubmit = (data: any) => {
  console.log("Transaction submitted:", data);
  // Later → useTransactionStore action goes here
  };


  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Sidebar */}
        {navbarOpen 
          ?
          <aside className="w-12 bg-white shadow-md p-2 flex flex-col">  
          <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 p-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl my-5">
            😊
          </div>
          <button onClick={() => setnavbarOpen(!navbarOpen)} className="p-5">☰</button>
          <div className="flex flex-col gap-4">
            <Link to='/' className="hover:bg-gray-200"><img src={dashboard} className="w-6 h-6"></img></Link>
            <Link to='/' className="hover:bg-gray-200"><img src={income} className="w-6 h-6"></img></Link>
            <Link to='/' className="hover:bg-gray-200"><img src={expense} className="w-6 h-6"></img></Link>
            <Link to='/' className="hover:bg-gray-200"><img src={forecast} className="w-6 h-6"></img></Link>
            <Link to='/' className="hover:bg-gray-200"><img src={settings} className="w-6 h-6"></img></Link>
            <Link to='/' className="hover:bg-gray-200"><img src={profile} className="w-6 h-6"></img></Link>
          </div>
          </div>
          </aside>
          :
          <aside className="w-56 bg-white shadow-md p-2 flex flex-col">
          <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl mb-2">
            😊
          </div>
          <span className="font-semibold m-4">Name</span>
          <button onClick={() => setnavbarOpen(!navbarOpen)} className="p-5">☰</button>
          <nav className="flex flex-col gap-2">
            <button className="text-left px-4 py-2 rounded hover:bg-gray-200 hover:font-semibold">Dashboard</button>
            <button className="text-left px-4 py-2 rounded hover:bg-gray-200 hover:font-semibold" onClick={() => setModalOpen(true)}>Income</button>
            <button className="text-left px-4 py-2 rounded hover:bg-gray-200 hover:font-semibold">Expense</button>
            <button className="text-left px-4 py-2 rounded hover:bg-gray-200 hover:font-semibold">Cash-Flow Forecast</button>
            <button className="text-left px-4 py-2 rounded hover:bg-gray-200 hover:font-semibold">Settings</button>
            <button className="text-left px-4 py-2 rounded hover:bg-gray-200 hover:font-semibold">Profile</button>
            <button className="text-left px-4 py-2 rounded hover:bg-gray-200 hover:font-semibold" onClick={() => SignOut(navigate)}>Sign Out</button>
          </nav>
        </div>
      </aside>
      }

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Cash Flow Monitor</h1>
            <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition"
              >
                + Add Transaction
            </button>
          </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Balance</p>
            <p className="text-xl font-bold">$1,000</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Income</p>
            <p className="text-xl font-bold">$2,000</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Expenses</p>
            <p className="text-xl font-bold">$700</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Net Monthly Change</p>
            <p className="text-xl font-bold text-green-600">+$1,300</p>
          </div>
        </div>

        {/* Risk Indicator */}
        <div className="bg-white p-5 rounded shadow flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Risk Status</h2>
            <p className="text-sm text-gray-500">
              Based on income, expenses & savings
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
            ✅ Safe
          </span>
        </div>

      {/* Cash Flow Forecast */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">Cash-Flow Forecast</h2>
          <p className="text-sm text-gray-500 mb-4">
            Monthly balance projection
          </p>
          <div className="h-80 flex items-center justify-center text-gray-400 font-semibold">
            <AreaChartComp />
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Avg Income", value: "$2,000" },
            { label: "Avg Expenses", value: "$700" },
            { label: "Monthly Net", value: "+$1,300" },
            { label: "Survival Months", value: "8 months" },
          ].map((item) => (
            <div key={item.label} className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-lg font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* What If Simulator */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">What If Simulator</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <input
              type="number"
              placeholder="Increase rent"
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Income change"
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="New expense"
              className="border rounded px-3 py-2"
            />
          </div>

          <div className="h-60 flex items-center justify-center text-gray-400 font-semibold">
            Updated Forecast Chart
          </div>
        </div>
      </main>
      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleTransactionSubmit}
      />
    </div>
  );
};

export default Dashboard;