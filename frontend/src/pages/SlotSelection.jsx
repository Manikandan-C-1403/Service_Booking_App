import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, DatePicker, TimePicker, Button, List, Alert, message, Breadcrumb } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, ArrowRightOutlined, ArrowLeftOutlined, HomeOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { bookingsAPI } from '../utils/api';
import dayjs from 'dayjs';

const SlotSelection = () => {
  const { cart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [unavailableServices, setUnavailableServices] = useState([]);
  const [checking, setChecking] = useState(false);

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  const handleCheckAvailability = async () => {
    if (!selectedDate || !selectedTime) {
      message.warning('Please select both date and time');
      return;
    }

    setChecking(true);
    try {
      const serviceIds = cart.map(item => item._id);
      const response = await bookingsAPI.checkAvailability({
        serviceIds,
        date: selectedDate.format('YYYY-MM-DD'),
        time: selectedTime.format('HH:mm')
      });

      setUnavailableServices(response.data.unavailableServices);

      if (response.data.available) {
        message.success('All services are available!');
      } else {
        message.warning('Some services are not available at this time');
      }
    } catch (error) {
      message.error('Failed to check availability');
    } finally {
      setChecking(false);
    }
  };

  const handleProceed = () => {
    if (!selectedDate || !selectedTime) {
      message.warning('Please select date and time');
      return;
    }

    if (unavailableServices.length > 0) {
      message.error('Please select a different slot or remove unavailable services');
      return;
    }

    navigate('/customer-details', {
      state: {
        date: selectedDate.format('YYYY-MM-DD'),
        time: selectedTime.format('HH:mm')
      }
    });
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
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
              title: <><ShoppingOutlined /> Cart</>
            },
            {
              title: <><CalendarOutlined /> Select Slot</>
            }
          ]}
        />
        <div className="mb-6 sm:mb-8">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            size="large"
            className="mb-4"
          >
            Back to Services
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Select Date & Time
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Selected Services" className="h-fit">
            <List
              dataSource={cart}
              renderItem={(item) => (
                <List.Item
                  className={
                    unavailableServices.includes(item._id)
                      ? 'bg-red-50 border border-red-200 rounded px-3'
                      : ''
                  }
                >
                  <List.Item.Meta
                    title={
                      <span className={unavailableServices.includes(item._id) ? 'text-red-600' : ''}>
                        {item.name} {unavailableServices.includes(item._id) && '(Unavailable)'}
                      </span>
                    }
                    description={`${item.duration} min • Qty: ${item.quantity}`}
                  />
                  <span className="font-semibold text-green-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </List.Item>
              )}
            />
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-xl font-bold text-green-600">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
          </Card>

          <Card title="Select Slot">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarOutlined /> Select Date
                </label>
                <DatePicker
                  size="large"
                  className="w-full"
                  disabledDate={disabledDate}
                  onChange={setSelectedDate}
                  placeholder="Choose a date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ClockCircleOutlined /> Select Time
                </label>
                <TimePicker
                  size="large"
                  className="w-full"
                  format="HH:mm"
                  minuteStep={15}
                  onChange={setSelectedTime}
                  placeholder="Choose a time"
                />
              </div>

              {unavailableServices.length > 0 && (
                <Alert
                  message="Some services are unavailable"
                  description="Services highlighted in red are not available at the selected time. Please choose a different slot."
                  type="error"
                  showIcon
                />
              )}

              <Button
                type="default"
                size="large"
                block
                onClick={handleCheckAvailability}
                loading={checking}
              >
                Check Availability
              </Button>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleProceed}
                icon={<ArrowRightOutlined />}
                disabled={!selectedDate || !selectedTime || unavailableServices.length > 0}
              >
                Proceed to Confirmation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SlotSelection;
