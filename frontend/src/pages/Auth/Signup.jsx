import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useFormState from '@/hooks/useFormState';
import { toast } from 'react-toastify';
import BASE_URL from '@/config';
import { useState } from 'react';

const Signup = () => {
    const [formData, handleChange, handleFileChange] = useFormState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePic: null
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
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
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/users/register`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(response.data.message || 'Signup successful!');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCustomFileChange = (e) => {
        handleFileChange(e);
        if (e.target.files[0]) {
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#E6E6E6] p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[#E6E6E6]">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#491B6D]">Join Us</h2>
                    <p className="text-[#4B4B4B] mt-2">Create your account to get started</p>
                </div>
                
                {previewImage && (
                    <div className="mb-6 flex justify-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#A26DB1]">
                            <img 
                                src={previewImage} 
                                alt="Profile preview" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[#4B4B4B] mb-1 ml-1">Full Name</label>
                        <input 
                            type="text" 
                            name="fullName" 
                            placeholder="John Doe" 
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full p-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A26DB1] bg-white shadow-sm"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-[#4B4B4B] mb-1 ml-1">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="email@example.com" 
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A26DB1] bg-white shadow-sm"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#4B4B4B] mb-1 ml-1">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="••••••••" 
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A26DB1] bg-white shadow-sm"
                                required
                                minLength={8}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#4B4B4B] mb-1 ml-1">Confirm Password</label>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                placeholder="••••••••" 
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A26DB1] bg-white shadow-sm"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-[#4B4B4B] mb-1 ml-1">Profile Picture</label>
                        <div className="relative">
                            <input 
                                type="file" 
                                name="profilePic"
                                id="profilePic"
                                accept="image/*"
                                onChange={handleCustomFileChange}
                                className="hidden"
                            />
                            <label 
                                htmlFor="profilePic" 
                                className="flex items-center justify-center w-full p-3 border border-dashed border-[#A26DB1] rounded-lg cursor-pointer bg-[#fcf9fe] hover:bg-[#f7f0fb] transition duration-300"
                            >
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#491B6D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-[#491B6D]">
                                        {formData.profilePic ? formData.profilePic.name : 'Upload your photo'}
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`w-full py-3 px-4 bg-[#491B6D] text-white rounded-lg font-medium shadow-md hover:bg-[#A26DB1] transition duration-300 flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </>
                        ) : 'Create Account'}
                    </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-[#E6E6E6] text-center">
                    <p className="text-[#4B4B4B]">
                        Already have an account? 
                        <Link to="/login" className="ml-1 text-[#491B6D] font-medium hover:text-[#A26DB1] transition duration-300">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;