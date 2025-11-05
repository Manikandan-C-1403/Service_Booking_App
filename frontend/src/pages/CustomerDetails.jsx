import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Input, Button, List, message, Breadcrumb } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CheckCircleOutlined, ArrowLeftOutlined, HomeOutlined, ShoppingOutlined, CalendarOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { bookingsAPI } from '../utils/api';

const CustomerDetails = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { date, time } = location.state || {};

  // Use useEffect to handle navigation instead of during render
  useEffect(() => {
    if (!date || !time || cart.length === 0) {
      navigate('/');
    }
  }, [date, time, cart.length, navigate]);

  // Show loading while redirecting
  if (!date || !time || cart.length === 0) {
    return null;
  }

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const bookingData = {
        services: cart.map(item => ({
          service: item._id,
          quantity: item.quantity
        })),
        customer: {
          name: values.name,
          email: values.email,
          phone: values.phone
        },
        bookingDate: date,
        bookingTime: time,
        totalPrice: getTotalPrice()
      };

      const response = await bookingsAPI.create(bookingData);
      
      if (response && response.data) {
        message.success('Booking confirmed successfully!');
        clearCart();
        
        // Small delay to ensure state is ready
        setTimeout(() => {
          // Navigate to confirmation page with booking data
          navigate('/booking-summary', { 
            state: { booking: response.data }
          });
        }, 100);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      message.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          className="mb-4 text-black"
          items={[
            {
              title: <a onClick={() => navigate('/')}><HomeOutlined /> Home</a>
            },
            {
              title: <a onClick={() => navigate('/slot-selection', { state: { date, time } })}><CalendarOutlined /> Select Slot</a>
            },
            {
              title: <><UserOutlined /> Customer Details</>
            }
          ]}
        />
        <div className="mb-6 sm:mb-8">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/slot-selection', { state: { date, time } })}
            size="large"
            className="mb-4"
          >
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Confirm Your Booking
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Booking Details">
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="text-lg font-semibold">{date} at {time}</p>
              </div>
            </div>

            <List
              header={<div className="font-semibold">Services</div>}
              dataSource={cart}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.duration} min • Qty: ${item.quantity}`}
                  />
                  <span className="font-semibold text-blue-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </List.Item>
              )}
            />

            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-lg font-bold">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
          </Card>

          <Card title="Your Information">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  { required: true, message: 'Please enter your name' },
                  { min: 2, message: 'Name must be at least 2 characters' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="John Doe"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="john@example.com"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please enter your phone number' },
                  { pattern: /^[0-9]{10,15}$/, message: 'Please enter a valid phone number' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="1234567890"
                  size="large"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                icon={<CheckCircleOutlined />}
              >
                Confirm Booking
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
