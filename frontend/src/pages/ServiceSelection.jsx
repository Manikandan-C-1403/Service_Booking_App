import { useState, useEffect } from 'react';
import { Input, Button, Card, Row, Col, message, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { servicesAPI } from '../utils/api';
import { useCart } from '../context/CartContext';

const { Meta } = Card;

const ServiceSelection = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
      setFilteredServices(response.data);
    } catch (error) {
      message.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(value.toLowerCase()) ||
        service.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const handleAddToCart = (service) => {
    addToCart(service);
    message.success(`${service.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Book a Service
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Browse our services and add them to your cart
          </p>
        </div>

        <div className="mb-6 sm:mb-8">
          <Space.Compact className="max-w-2xl" style={{ width: '100%' }}>
            <Input
              placeholder="Search services by name or description"
              allowClear
              size="large"
              onChange={(e) => handleSearch(e.target.value)}
              onPressEnter={(e) => handleSearch(e.target.value)}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={() => handleSearch(searchTerm)}
            >
              Search
            </Button>
          </Space.Compact>
        </div>

        {filteredServices.length === 0 && !loading ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-lg sm:text-xl text-gray-600">No matching services found.</p>
          </div>
        ) : (
          <Row gutter={[16, 16]} className="sm:gutter-[24, 24]">
            {filteredServices.map((service) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={service._id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={service.name}
                      src={service.image}
                      className="h-48 object-cover"
                    />
                  }
                  loading={loading}
                  className="h-full"
                >
                  <Meta
                    title={
                      <span className="text-lg font-semibold">{service.name}</span>
                    }
                    description={
                      <div className="space-y-2 mt-2">
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex justify-between items-center pt-2">
                          <div>
                            <p className="text-gray-900 font-bold text-xl">
                              ${service.price}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {service.duration} min
                            </p>
                          </div>
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddToCart(service)}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default ServiceSelection;
