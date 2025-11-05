import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Statistic, Spin, Progress, Tag } from 'antd';
import { 
  AppstoreOutlined, 
  CalendarOutlined, 
  DollarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  RiseOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import { servicesAPI, bookingsAPI } from '../../utils/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [servicesResponse, bookingsResponse] = await Promise.all([
        servicesAPI.getAll(),
        bookingsAPI.getAll()
      ]);

      const services = servicesResponse.data;
      const bookings = bookingsResponse.data;

      const pendingCount = bookings.filter(b => b.status === 'pending').length;
      const totalRevenue = bookings
        .filter(b => b.status !== 'cancelled')
        .reduce((sum, booking) => sum + booking.totalPrice, 0);

      setStats({
        totalServices: services.length,
        totalBookings: bookings.length,
        pendingBookings: pendingCount,
        totalRevenue: totalRevenue
      });
    } catch (error) {
      message.error('Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">Monitor your business performance and manage operations</p>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card 
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Total Services</p>
                  <p className="text-3xl font-bold text-white">{stats.totalServices}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <RiseOutlined className="text-green-300" />
                    <span className="text-green-300 text-xs">Active</span>
                  </div>
                </div>
                <div className="bg-white/20 p-4 rounded-full">
                  <AppstoreOutlined className="text-4xl text-white" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <UserOutlined className="text-pink-200" />
                    <span className="text-pink-200 text-xs">All time</span>
                  </div>
                </div>
                <div className="bg-white/20 p-4 rounded-full">
                  <CalendarOutlined className="text-4xl text-white" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                color: '#78350f'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-800/70 text-sm mb-1">Pending</p>
                  <p className="text-3xl font-bold text-amber-900">{stats.pendingBookings}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ClockCircleOutlined className="text-amber-700" />
                    <span className="text-amber-700 text-xs">Awaiting</span>
                  </div>
                </div>
                <div className="bg-amber-900/20 p-4 rounded-full">
                  <ClockCircleOutlined className="text-4xl text-amber-900" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                color: '#065f46'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-800/70 text-sm mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-900">${stats.totalRevenue.toFixed(2)}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircleOutlined className="text-green-700" />
                    <span className="text-green-700 text-xs">Earned</span>
                  </div>
                </div>
                <div className="bg-green-900/20 p-4 rounded-full">
                  <DollarOutlined className="text-4xl text-green-900" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        </div>
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} md={8}>
            <Link to="/admin/services">
              <Card 
                hoverable 
                className="text-center border-2 border-blue-100 hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-xl"
                style={{ height: '100%' }}
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <AppstoreOutlined className="text-3xl text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Manage Services</h2>
                <p className="text-gray-600">
                  Add, edit, or delete services from your catalog
                </p>
                <div className="mt-4 text-blue-600 font-medium text-sm">
                  Go to Services →
                </div>
              </Card>
            </Link>
          </Col>

          <Col xs={24} md={8}>
            <Link to="/admin/bookings">
              <Card 
                hoverable 
                className="text-center border-2 border-purple-100 hover:border-purple-400 transition-all duration-300 shadow-md hover:shadow-xl"
                style={{ height: '100%' }}
              >
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CalendarOutlined className="text-3xl text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">View Bookings</h2>
                <p className="text-gray-600">
                  Manage customer bookings and appointments
                </p>
                <div className="mt-4 text-purple-600 font-medium text-sm">
                  Go to Bookings →
                </div>
              </Card>
            </Link>
          </Col>

          <Col xs={24} md={8}>
            <Card 
              className="text-center border-2 border-green-100 shadow-md"
              style={{ height: '100%' }}
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircleOutlined className="text-3xl text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Success Rate</h2>
              <div className="mt-4">
                <Progress 
                  type="circle" 
                  percent={stats.totalBookings > 0 ? Math.round((stats.totalBookings - stats.pendingBookings) / stats.totalBookings * 100) : 0}
                  strokeColor={{
                    '0%': '#10b981',
                    '100%': '#059669',
                  }}
                  size={100}
                />
              </div>
              <p className="text-gray-600 mt-3 text-sm">
                Completed bookings
              </p>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Status</h2>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card className="shadow-md border-0">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AppstoreOutlined className="text-blue-600" />
                Service Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Services</span>
                  <Tag color="green" className="font-medium">{stats.totalServices} Active</Tag>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Categories</span>
                  <span className="font-semibold text-gray-800">All Services</span>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card className="shadow-md border-0">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CalendarOutlined className="text-purple-600" />
                Booking Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Review</span>
                  <Tag color="orange" className="font-medium">{stats.pendingBookings} Pending</Tag>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Processed</span>
                  <span className="font-semibold text-gray-800">{stats.totalBookings - stats.pendingBookings} Completed</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
