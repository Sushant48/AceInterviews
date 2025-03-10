import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6E6E6]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-[#491B6D] text-center">Login</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-[#4B4B4B]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-[#F5F5F5] focus:outline-[#491B6D]"
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#4B4B4B]">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-[#F5F5F5] focus:outline-[#491B6D]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#491B6D] text-white p-2 rounded-lg hover:bg-[#A26DB1] transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-[#4B4B4B] mt-4">
          Don’t have an account? <Link to="/signup" className="text-[#491B6D]">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
