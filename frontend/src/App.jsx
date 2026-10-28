import { Route, Routes } from 'react-router-dom';
import AboutPage from './pages/AboutPage.jsx';
import AppLayout from './pages/AppLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NewBookingPage from './pages/NewBookingPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import BookingDetailPage from './pages/BookingDetailPage.jsx';
import BookingHistoryPage from './pages/BookingHistoryPage.jsx';
import RoomListPage from './pages/RoomListPage.jsx';
import RoomDetailsPage from './pages/RoomDetailsPage.jsx';
import StaffBookingManagementPage from './pages/StaffBookingManagementPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="rooms" element={<RoomListPage />} />
        <Route path="rooms/:roomId" element={<RoomDetailsPage />} />
        <Route path="bookings/new" element={<NewBookingPage />} />
        <Route path="bookings/history" element={<BookingHistoryPage />} />
        <Route path="bookings/:bookingId" element={<BookingDetailPage />} />
        <Route path="staff/bookings" element={<StaffBookingManagementPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
