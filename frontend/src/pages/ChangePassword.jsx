import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BASE_URL from "@/config";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/users/change-password`, 
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        }, 
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      
      toast.success(response.data.data.message || "Password updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-[#491B6D] text-center mb-2">Change Password</h2>
        <p className="text-[#4B4B4B] text-center mb-6">Update your password to keep your account secure</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#4B4B4B] font-medium mb-1">Current Password</label>
            <div className="relative">
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.oldPassword ? 'border-red-500' : 'border-[#D9D9D9]'} rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#491B6D] focus:border-transparent transition-all duration-200`}
                placeholder="Enter your current password"
              />
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-[#4B4B4B] font-medium mb-1">New Password</label>
            <div className="relative">
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.newPassword ? 'border-red-500' : 'border-[#D9D9D9]'} rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#491B6D] focus:border-transparent transition-all duration-200`}
                placeholder="Create a new password"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-[#4B4B4B] font-medium mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-[#D9D9D9]'} rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#491B6D] focus:border-transparent transition-all duration-200`}
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#491B6D] text-white py-3 px-4 rounded-lg hover:bg-[#A26DB1] focus:ring-4 focus:ring-[#A26DB1] focus:ring-opacity-50 transition-all duration-300 flex items-center justify-center font-medium text-lg mt-6"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : (
              "Update Password"
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full text-[#4B4B4B] py-2 px-4 rounded-lg hover:bg-gray-100 focus:bg-gray-100 transition-all duration-300 text-center mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;