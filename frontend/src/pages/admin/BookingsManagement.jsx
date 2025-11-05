import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Popconfirm,
  message,
  Modal,
  Descriptions,
  Breadcrumb
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  HomeOutlined,
  DashboardOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { bookingsAPI, servicesAPI } from '../../utils/api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    customer: '',
    service: '',
    startDate: '',
    endDate: ''
  });
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services');
    }
  };

  const fetchBookings = async (params = {}) => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getAll(params);
      setBookings(response.data);
    } catch (error) {
      message.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    const params = {};
    if (filters.customer) params.customer = filters.customer;
    if (filters.service) params.service = filters.service;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    
    fetchBookings(params);
  };

  const handleClearFilters = () => {
    setFilters({
      customer: '',
      service: '',
      startDate: '',
      endDate: ''
    });
    fetchBookings();
  };

  const handleCancel = async (id) => {
    try {
      await bookingsAPI.cancel(id);
      message.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      message.error('Failed to cancel booking');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsVisible(true);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setFilters({
        ...filters,
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD')
      });
    } else {
      setFilters({
        ...filters,
        startDate: '',
        endDate: ''
      });
    }
  };

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: '_id',
      key: '_id',
      width: 100,
      render: (id) => id.slice(-8)
    },
    {
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      key: 'customerName'
    },
    {
      title: 'Email',
      dataIndex: ['customer', 'email'],
      key: 'email',
      ellipsis: true
    },
    {
      title: 'Phone',
      dataIndex: ['customer', 'phone'],
      key: 'phone'
    },
    {
      title: 'Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (date) => dayjs(date).format('MMM D, YYYY')
    },
    {
      title: 'Time',
      dataIndex: 'bookingTime',
      key: 'bookingTime'
    },
    {
      title: 'Services',
      dataIndex: 'services',
      key: 'services',
      render: (services) => services.length
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `$${price.toFixed(2)}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          pending: 'orange',
          confirmed: 'blue',
          cancelled: 'red',
          completed: 'green'
        };
        return (
          <Tag color={colors[status]}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            View
          </Button>
          {record.status !== 'cancelled' && (
            <Popconfirm
              title="Are you sure you want to cancel this booking?"
              onConfirm={() => handleCancel(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                icon={<CloseCircleOutlined />}
                size="small"
              >
                Cancel
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-4 sm:py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          className="mb-4"
          items={[
            {
              title: <Link to="/"><HomeOutlined /> Home</Link>
            },
            {
              title: <><CalendarOutlined /> Bookings</>
            }
          ]}
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Bookings Management
        </h1>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <Input
              placeholder="Search by customer name"
              prefix={<SearchOutlined />}
              value={filters.customer}
              onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
              allowClear
            />

            <Select
              placeholder="Filter by service"
              value={filters.service || undefined}
              onChange={(value) => setFilters({ ...filters, service: value })}
              allowClear
              className="w-full"
            >
              {services.map(service => (
                <Select.Option key={service._id} value={service._id}>
                  {service.name}
                </Select.Option>
              ))}
            </Select>

            <RangePicker
              onChange={handleDateRangeChange}
              className="w-full"
            />

            <Space>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={handleFilter}
              >
                Apply Filters
              </Button>
              <Button onClick={handleClearFilters}>
                Clear
              </Button>
            </Space>
          </div>
        </div>

        <div className="overflow-x-auto md:overflow-x-hidden">
        <Table
          columns={columns}
          dataSource={bookings}
          loading={loading}
          rowKey="_id"
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} bookings`
          }}
        />
        </div>

        <Modal
          title="Booking Details"
          open={detailsVisible}
          onCancel={() => setDetailsVisible(false)}
          footer={null}
          width={700}
        >
          {selectedBooking && (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Booking ID">
                {selectedBooking._id}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {selectedBooking.customer.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedBooking.customer.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedBooking.customer.phone}
              </Descriptions.Item>
              /<Descriptions.Item label="Booking Date">
                {dayjs(selectedBooking.bookingDate).format('MMMM D, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Booking Time">
                {selectedBooking.bookingTime}
              </Descriptions.Item>
              <Descriptions.Item label="Services">
                {selectedBooking.services.map((item, index) => (
                  <div key={index} className="mb-2">
                    <strong>{item.service.name}</strong>
                    <div className="text-sm text-gray-600">
                      Quantity: {item.quantity} | Duration: {item.service.duration} min | 
                      Price: ${item.service.price}
                    </div>
                  </div>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <span className="text-xl font-bold text-green-600">
                  ${selectedBooking.totalPrice.toFixed(2)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  selectedBooking.status === 'confirmed' ? 'blue' :
                  selectedBooking.status === 'cancelled' ? 'red' :
                  selectedBooking.status === 'completed' ? 'green' : 'orange'
                }>
                  {selectedBooking.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {dayjs(selectedBooking.createdAt).format('MMMM D, YYYY h:mm A')}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default BookingsManagement;
