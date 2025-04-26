import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "@/config";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username || formData.username.trim() === "") {
      newErrors.username = "Name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.patch(
        `${BASE_URL}/users/update-account`, 
        formData, 
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      
      setUser(response.data.data.user);
      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-[#491B6D] text-center mb-2">Your Profile</h2>
        <p className="text-[#4B4B4B] text-center mb-6">Update your personal information</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#4B4B4B] font-medium mb-1">Name</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.username ? 'border-red-500' : 'border-[#D9D9D9]'} rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#491B6D] focus:border-transparent transition-all duration-200`}
                placeholder="Your full name"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-[#4B4B4B] font-medium mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-[#D9D9D9]'} rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#491B6D] focus:border-transparent transition-all duration-200`}
                placeholder="Your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#E6E6E6]">
            <button
              type="button"
              onClick={() => navigate('/change-password')}
              className="text-[#491B6D] hover:text-[#A26DB1] font-medium transition-colors duration-200"
            >
              Change Password
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#491B6D] text-white py-3 px-4 rounded-lg hover:bg-[#A26DB1] focus:ring-4 focus:ring-[#A26DB1] focus:ring-opacity-50 transition-all duration-300 flex items-center justify-center font-medium"
            >
              {isLoading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 border border-[#D9D9D9] text-[#4B4B4B] py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;