import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import BASE_URL from "@/config";
import { useNavigate } from "react-router-dom";

const ProfilePicture = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!image) return toast.error("Please select an image!");

    const formData = new FormData();
    formData.append("profilePic", image);

    try {
      const response = await axios.patch(`${BASE_URL}/users/profile-image`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser({ ...user, profilePic: response.data.data.profilePic });
      toast.success("Profile picture updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile picture");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6E6E6]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-[#491B6D] text-center">Update Profile Picture</h2>
        {preview && <img src={preview} alt="Preview" className="w-32 h-32 rounded-full mx-auto mt-4" />}
        <form onSubmit={handleUpload} className="mt-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer"
          />
          <button
            type="submit"
            className="w-full bg-[#491B6D] text-white p-2 rounded-lg hover:bg-[#A26DB1] transition mt-4"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePicture;
