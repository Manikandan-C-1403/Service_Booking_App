import { Drawer, Button, Empty } from 'antd';
import { DeleteOutlined, ShoppingOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ visible, onClose }) => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleProceed = () => {
    onClose();
    navigate('/slot-selection');
  };

  return (
    <Drawer
      title="Your Cart"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      footer={
        cart.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-lg font-bold border-t pt-3">
              <span>Total:</span>
              <span className="text-green-600 font-bold">${getTotalPrice().toFixed(2)}</span>
            </div>
            <Button
              type="primary"
              size="large"
              block
              onClick={handleProceed}
              icon={<ShoppingOutlined />}
            >
              Proceed to Booking
            </Button>
          </div>
        )
      }
    >
      {cart.length === 0 ? (
        <Empty description="Your cart is empty" />
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-base">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.duration} minutes</p>
                  <p className="text-gray-900 font-semibold mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeFromCart(item._id)}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    className="flex items-center justify-center"
                  />
                  <span className="font-semibold text-base min-w-[30px] text-center">
                    {item.quantity}
                  </span>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => updateQuantity(item._id, Math.min(10, item.quantity + 1))}
                    disabled={item.quantity >= 10}
                    className="flex items-center justify-center"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">Subtotal:</span>
                <span className="font-semibold text-green-600">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;
