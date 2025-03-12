import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BASE_URL from "@/config";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/users/change-password`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);
      
      toast.success(response.data.data.message || "Password updated successfully");
      navigate("/dashboard");
    } catch (error) {
        console.log(error);
        
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6E6E6]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-[#491B6D] text-center">Change Password</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-[#4B4B4B]">Current Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-[#F5F5F5] focus:outline-[#491B6D]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#4B4B4B]">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-[#F5F5F5] focus:outline-[#491B6D]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#491B6D] text-white p-2 rounded-lg hover:bg-[#A26DB1] transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
