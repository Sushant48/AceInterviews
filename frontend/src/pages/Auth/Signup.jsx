import { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePic: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            profilePic: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log(formData); // Will replace this with API call later
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
