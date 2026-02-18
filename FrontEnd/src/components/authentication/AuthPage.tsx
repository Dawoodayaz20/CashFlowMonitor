import React, { useState } from "react";
import {SignUp, SignIn} from "./testbackend";
// import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");

  const [signin, setSignIn] = useState<boolean>(true)

  const toggleSignin = () => {
    return setSignIn(!signin);
  }

  const navigate = useNavigate();

  // const { user } = useAuthStore();
  // console.log('Current user:', user);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">CashFlow Monitor</h1>
          <p className="text-sm text-gray-500">
            Sign in to manage your cash flow
          </p>
        </div>

        {/* Form */}
        { signin ?
          <div>
          <form className="space-y-4">
          <div>
            {/* <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              placeholder="Name"
              onChange={e => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={e => setPass(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me!
            </label>
            <button type="button" className="text-blue-600 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            onClick={() => SignIn(email, pass, navigate)}
            type='button'
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign in
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        
        <button 
        onClick={toggleSignin}
        className="w-full border py-2 rounded hover:bg-gray-100 transition">
          Create new account
        </button>
        </div>

        :
        <div>
        <form className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              placeholder="Name"
              onChange={e => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={e => setPass(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me!
            </label>
            <button type="button" className="text-blue-600 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            onClick={(() => SignUp(name, email, pass))}
            type='button'
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        
          {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Secondary Action */}
        <button 
        onClick={toggleSignin}
        className="w-full border py-2 rounded hover:bg-gray-100 transition">
          Already have an account!
        </button>
        </div>
        }

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          © 2026 CashFlow Monitor
        </p>
      </div>
    </div>
  );
};

export default Auth;
