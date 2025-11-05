import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Badge, Button, Menu, Dropdown, Drawer } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, HomeOutlined, AppstoreOutlined, CalendarOutlined, DashboardOutlined, DownOutlined, MenuOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const { getCartCount } = useCart();
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartVisible, setCartVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="no-underline">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer">
                BookIt
              </div>
            </Link>
            {isAdminRoute && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                <DashboardOutlined className="text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Admin Panel</span>
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {!isAdminRoute && (
              <>
                <Badge 
                  count={getCartCount()} 
                  showZero
                  style={{ backgroundColor: '#16a34a' }}
                >
                  <Button
                    type="default"
                    icon={<ShoppingCartOutlined className="text-lg" />}
                    size="large"
                    onClick={() => setCartVisible(true)}
                    className="font-medium border-2 border-gray-300 hover:border-green-500 hover:text-green-600"
                  >
                    Cart ({getCartCount()})
                  </Button>
                </Badge>
              </>
            )}

            {isAdminRoute && admin && (
              <div className="flex items-center gap-2">
                <Button
                  type={location.pathname === '/admin/services' ? 'primary' : 'default'}
                  icon={<AppstoreOutlined />}
                  onClick={() => navigate('/admin/services')}
                  className={`font-medium ${location.pathname === '/admin/services' ? 'shadow-md' : ''}`}
                >
                  Services
                </Button>
                <Button
                  type={location.pathname === '/admin/bookings' ? 'primary' : 'default'}
                  icon={<CalendarOutlined />}
                  onClick={() => navigate('/admin/bookings')}
                  className={`font-medium ${location.pathname === '/admin/bookings' ? 'shadow-md' : ''}`}
                >
                  Bookings
                </Button>
                <div className="h-8 w-px bg-gray-300"></div>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'profile',
                        icon: <UserOutlined />,
                        label: admin.username,
                        disabled: true
                      },
                      {
                        type: 'divider'
                      },
                      {
                        key: 'logout',
                        icon: <LogoutOutlined />,
                        label: 'Logout',
                        danger: true,
                        onClick: handleLogout
                      }
                    ]
                  }}
                  placement="bottomRight"
                >
                  <Button 
                    icon={<UserOutlined />}
                    className="font-medium border-2 border-blue-200 hover:border-blue-400"
                  >
                    {admin.username} <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            )}

            {isAdminRoute && !admin && (
              <Button 
                type="primary" 
                onClick={() => navigate('/admin/login')}
                size="large"
                className="font-medium"
              >
                Admin Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {!isAdminRoute && (
              <div className="flex items-center gap-2">
                <Badge 
                  count={getCartCount()} 
                  showZero
                  style={{ backgroundColor: '#16a34a' }}
                >
                  <Button
                    type="default"
                    icon={<ShoppingCartOutlined />}
                    size="large"
                    onClick={() => setCartVisible(true)}
                    className="border-2 border-gray-300"
                  />
                </Badge>
                <Button
                  type="default"
                  icon={<MenuOutlined />}
                  size="large"
                  onClick={() => setMobileMenuVisible(true)}
                />
              </div>
            )}
            {isAdminRoute && admin && (
              <Button
                type="default"
                icon={<MenuOutlined />}
                size="large"
                onClick={() => setMobileMenuVisible(true)}
              />
            )}
            {isAdminRoute && !admin && (
              <Button 
                type="primary" 
                onClick={() => navigate('/admin/login')}
                size="large"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Drawer */}
    <Drawer
      title="Menu"
      placement="right"
      onClose={() => setMobileMenuVisible(false)}
      open={mobileMenuVisible}
      width={280}
    >
      <div className="flex flex-col gap-3">
        {!isAdminRoute && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              Your cart is ready for checkout
            </p>
          </div>
        )}
        
        {isAdminRoute && admin && (
          <>
            <div className="mb-4 pb-4 border-b">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Admin Panel</p>
              <Button
                type={location.pathname === '/admin/services' ? 'primary' : 'default'}
                icon={<AppstoreOutlined />}
                size="large"
                block
                onClick={() => {
                  navigate('/admin/services');
                  setMobileMenuVisible(false);
                }}
              >
                Services
              </Button>
              <Button
                type={location.pathname === '/admin/bookings' ? 'primary' : 'default'}
                icon={<CalendarOutlined />}
                size="large"
                block
                onClick={() => {
                  navigate('/admin/bookings');
                  setMobileMenuVisible(false);
                }}
                className="mt-2"
              >
                Bookings
              </Button>
            </div>
            <div className="pt-3">
              <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Logged in as</div>
                <div className="text-gray-700 font-semibold flex items-center gap-2">
                  <UserOutlined /> {admin.username}
                </div>
              </div>
              <Button
                danger
                icon={<LogoutOutlined />}
                size="large"
                block
                onClick={() => {
                  handleLogout();
                  setMobileMenuVisible(false);
                }}
              >
                Logout
              </Button>
            </div>
          </>
        )}
      </div>
    </Drawer>

    {/* Cart Drawer */}
    {!isAdminRoute && <CartDrawer visible={cartVisible} onClose={() => setCartVisible(false)} />}
    </>
  );
};

export default Navbar;
