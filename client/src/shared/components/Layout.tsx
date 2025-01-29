import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';

export default function Layout() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}