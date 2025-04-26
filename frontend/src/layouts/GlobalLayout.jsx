import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const GlobalLayout = () => {
  return (
    <div className="min-h-screen bg-[#E6E6E6] text-black">
      <Navbar />
      <main className="p-2">
        <Outlet />
      </main>
    </div>
  );
};

export default GlobalLayout;
