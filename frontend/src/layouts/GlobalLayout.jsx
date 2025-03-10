import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const GlobalLayout = () => {
  return (
    <div className="min-h-screen bg-[#E6E6E6] text-black">
      <Navbar />
      <main className="p-4">
        <Outlet /> {/* Renders nested pages */}
      </main>
    </div>
  );
};

export default GlobalLayout;
