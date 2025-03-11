import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useFormState from '@/hooks/useFormState';
import { toast } from 'react-toastify';
import BASE_URL from '@/config';

const Signup = () => {
    const [formData, handleChange, handleFileChange] = useFormState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePic: null
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.fullName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('profilePic', formData.profilePic);

        try {
            const response = await axios.post(`${BASE_URL}/users/register`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(response.data.message || 'Signup successful!');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#E6E6E6]">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-[#491B6D] mb-6">Create an Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        name="fullName" 
                        placeholder="Full Name" 
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-2 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A26DB1]"
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A26DB1]"
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A26DB1]"
                    />
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Confirm Password" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A26DB1]"
                    />
                    <input 
                        type="file" 
                        name="profilePic"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-[#D9D9D9] rounded-lg"
                    />
                    <button 
                        type="submit" 
                        className="w-full bg-[#491B6D] text-white py-2 rounded-lg hover:bg-[#A26DB1] transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-center text-[#4B4B4B] mt-4">
                    Already have an account? <Link to="/login" className="text-[#A26DB1] hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
