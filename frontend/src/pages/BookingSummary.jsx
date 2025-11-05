import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, Button, Divider } from 'antd';
import { CheckCircleOutlined, HomeOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, PhoneOutlined, MailOutlined, PrinterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { booking } = location.state || {};

  // Use useEffect for navigation to avoid render issues
  useEffect(() => {
    if (!booking) {
      const timer = setTimeout(() => navigate('/'), 2000);
      return () => clearTimeout(timer);
    }
  }, [booking, navigate]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">No Booking Data Found</h2>
          <p className="text-gray-600">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircleOutlined className="text-5xl text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your appointment has been successfully scheduled
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-sm border border-gray-200 mb-6">
          {/* Booking Reference */}
          <div className="text-center pb-6 border-b">
            <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
            <p className="text-2xl font-bold text-gray-900 font-mono">
              #{booking._id.substring(booking._id.length - 8).toUpperCase()}
            </p>
          </div>

          {/* Customer Information */}
          <div className="py-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <UserOutlined className="text-gray-400 text-lg" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{booking.customer.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MailOutlined className="text-gray-400 text-lg" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{booking.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PhoneOutlined className="text-gray-400 text-lg" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{booking.customer.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="py-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CalendarOutlined className="text-gray-400 text-lg" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">
                    {dayjs(booking.bookingDate).format('MMM D, YYYY')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ClockCircleOutlined className="text-gray-400 text-lg" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">{booking.bookingTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Booked</h3>
            <div className="space-y-3">
              {booking.services.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    {item.service.image && (
                      <img
                        src={item.service.image}
                        alt={item.service.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.service.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(item.service.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Divider className="my-4" />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-green-600">
                ${booking.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Info Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 text-center">
            📧 A confirmation email has been sent to <strong>{booking.customer.email}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          <Button
            size="large"
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
          >
            Print Confirmation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
