import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  TimePicker,
  message,
  Popconfirm,
  Space,
  Tag,
  Breadcrumb,
  Upload,
  Image
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  UploadOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../../utils/api';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      message.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    setImageUrl('');
    form.resetFields();
    form.setFieldsValue({
      availability: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: {
          start: '09:00',
          end: '17:00'
        }
      }
    });
    setModalVisible(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setImageUrl(service.image || '');
    form.setFieldsValue({
      ...service,
      availability: {
        ...service.availability,
        workingHours: {
          start: service.availability?.workingHours?.start || '09:00',
          end: service.availability?.workingHours?.end || '17:00'
        }
      }
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await servicesAPI.delete(id);
      message.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      message.error('Failed to delete service');
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setImageUrl(data.url);
      form.setFieldsValue({ image: data.url });
      message.success('Image uploaded successfully');
    } catch (error) {
      message.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Add image URL to form values
      const serviceData = {
        ...values,
        image: imageUrl || 'https://via.placeholder.com/400x300?text=Service+Image'
      };

      if (editingService) {
        await servicesAPI.update(editingService._id, serviceData);
        message.success('Service updated successfully');
      } else {
        await servicesAPI.create(serviceData);
        message.success('Service created successfully');
      }
      setModalVisible(false);
      setImageUrl('');
      fetchServices();
    } catch (error) {
      message.error('Failed to save service');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image) => (
        <img src={image} alt="Service" className="w-16 h-16 object-cover rounded" />
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} min`
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this service?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          className="mb-4"
          items={[
            {
              title: <Link to="/"><HomeOutlined /> Home</Link>
            },
            {
              title: <><AppstoreOutlined /> Services</>
            }
          ]}
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Service Management</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
            block
            className="sm:block sm:w-auto"
          >
            Add Service
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={services}
            loading={loading}
            rowKey="_id"
            scroll={{ x: 800 }}
          />
        </div>

        <Modal
          title={editingService ? 'Edit Service' : 'Add Service'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Service Name"
              rules={[{ required: true, message: 'Please enter service name' }]}
            >
              <Input placeholder="e.g., House Cleaning" size="large" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <TextArea
                rows={3}
                placeholder="Describe the service"
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="price"
                label="Price ($)"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  className="w-full"
                  size="large"
                  placeholder="50.00"
                />
              </Form.Item>

              <Form.Item
                name="duration"
                label="Duration (minutes)"
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <InputNumber
                  min={15}
                  step={15}
                  className="w-full"
                  size="large"
                  placeholder="60"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="image"
              label="Service Image"
            >
              <div className="space-y-4">
                <Upload
                  name="image"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleImageUpload(file);
                    return false; // Prevent auto upload
                  }}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="Service" className="w-full h-full object-cover" />
                  ) : (
                    <div>
                      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div className="mt-2">Upload Image</div>
                    </div>
                  )}
                </Upload>
                {imageUrl && (
                  <Button
                    onClick={() => {
                      setImageUrl('');
                      form.setFieldsValue({ image: '' });
                    }}
                    danger
                  >
                    Remove Image
                  </Button>
                )}
              </div>
            </Form.Item>

            <Form.Item
              name={['availability', 'workingDays']}
              label="Working Days"
            >
              <Select
                mode="multiple"
                placeholder="Select working days"
                size="large"
              >
                {weekDays.map(day => (
                  <Option key={day} value={day}>{day}</Option>
                ))}
              </Select>
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name={['availability', 'workingHours', 'start']}
                label="Start Time"
              >
                <Input type="time" size="large" />
              </Form.Item>

              <Form.Item
                name={['availability', 'workingHours', 'end']}
                label="End Time"
              >
                <Input type="time" size="large" />
              </Form.Item>
            </div>

            <Form.Item
              name="isActive"
              label="Status"
              valuePropName="checked"
            >
              <Select size="large" defaultValue={true}>
                <Option value={true}>Active</Option>
                <Option value={false}>Inactive</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space className="w-full justify-end">
                <Button onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingService ? 'Update' : 'Create'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ServiceManagement;
