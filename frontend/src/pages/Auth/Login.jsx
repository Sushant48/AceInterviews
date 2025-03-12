import { useNavigate } from "react-router-dom";
import axios from "axios";
import useFormState from "@/hooks/useFormState";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/AuthContext";
import BASE_URL from "@/config";

const Login = () => {
  const [formData, handleChange] = useFormState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const {setUser} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/users/login`, formData, { withCredentials: true },
          {headers: { "Content-Type": "application/json" }},
      );
      
      setUser(response.data.data.user);
      toast.success(response.data.message || "Login successful!");
      navigate("/dashboard");
  } catch (error) {
      const message = error.response?.data?.message || "An unexpected error occurred";
      toast.error(message);
  }
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
          Don’t have an account?{" "}
          <a href="/signup" className="text-[#491B6D]">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
