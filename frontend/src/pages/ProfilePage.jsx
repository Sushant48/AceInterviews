import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "@/config";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email:  user?.email || "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`${BASE_URL}/users/update-account`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setUser(response.data.data.user);    
      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6E6E6]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-[#491B6D] text-center">Profile</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-[#4B4B4B]">Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-[#F5F5F5] focus:outline-[#491B6D]"
            />
          </div>
          <div className="mb-6">
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
          <button
            type="submit"
            className="w-full bg-[#491B6D] text-white p-2 rounded-lg hover:bg-[#A26DB1] transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
