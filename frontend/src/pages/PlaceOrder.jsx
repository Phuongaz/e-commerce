import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../context/Shopcontext";
import { backendUrl } from "../api/axiosInstance";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    navigate,
    loading,
    setLoading,
    updateQuantity,
    currency
  } = useContext(ShopContext);

  const location = useLocation();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    province: null,
    district: null,
    commune: null,
    address: ""
  });

  // Process cart items for display
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0 && Array.isArray(cartItems)) {
      const tempData = cartItems
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          _id: item.product_id,
          size: item.size,
          quantity: item.quantity
        }));
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // Get product image URL
  const getImageUrl = (imageId) => {
    if (!imageId) return '';
    return `${backendUrl}/api/product/image/${imageId}`;
  };

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/p/`
        );
        const provinceOptions = response.data.map((province) => ({
          label: province.name,
          value: province.code
        }));
        setProvinces(provinceOptions);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        toast.error("Không thể tải danh sách tỉnh/thành phố");
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  const handleProvinceChange = async (selectedOption) => {
    setFormData({
      ...formData,
      province: selectedOption,
      district: null,
      commune: null
    });

    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${selectedOption.value}?depth=2`
      );
      const districtOptions = response.data.districts.map((district) => ({
        label: district.name,
        value: district.code
      }));
      setDistricts(districtOptions);
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Không thể tải danh sách quận/huyện");
    }
  };

  // Fetch communes when district changes
  const handleDistrictChange = async (selectedOption) => {
    setFormData({
      ...formData,
      district: selectedOption,
      commune: null
    });

    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${selectedOption.value}?depth=2`
      );
      const communeOptions = response.data.wards.map((commune) => ({
        label: commune.name,
        value: commune.code
      }));
      setCommunes(communeOptions);
    } catch (error) {
      console.error("Error fetching communes:", error);
      toast.error("Không thể tải danh sách phường/xã");
    }
  };

  // Handle commune selection
  const handleCommuneChange = (selectedOption) => {
    setFormData({
      ...formData,
      commune: selectedOption
    });
  };

  // Handle input change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Validate cart items
    if (!cartData || cartData.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống!");
      navigate("/cart");
      return;
    }
    
    // Validate location selection
    if (!formData.province || !formData.district || !formData.commune) {
      toast.error("Vui lòng chọn đầy đủ địa chỉ (Tỉnh/Thành phố, Quận/Huyện, Phường/Xã)");
      return;
    }

    setLoading(true);

    try {
      // Prepare order items from cart data
      let orderItems = [];
      
      if (Array.isArray(cartItems)) {
        cartItems.forEach(item => {
          const itemInfo = products.find((product) => product._id === item.product_id);
          if (itemInfo && item.quantity > 0) {
            orderItems.push({
              ...itemInfo,
              size: item.size,
              quantity: item.quantity
            });
          }
        });
      }

      const fullAddress = {
        province: formData.province.label,
        district: formData.district.label,
        commune: formData.commune.label,
        address: formData.address
      };

      let orderData = {
        address: fullAddress,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod":
          const response = await axios.post(
            `${backendUrl}/api/orders`,
            orderData,
            { withCredentials: true }
          );
          if (response.data.success) {
            setCartItems([]);
            localStorage.removeItem("guestCart");
            toast.success("Đặt hàng thành công!");
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error(error.response?.data?.message || error.message || "Có lỗi xảy ra khi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Title text1={"ĐẶT"} text2={"HÀNG"} />
        </div>

        <form onSubmit={onSubmitHandler}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Delivery Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Thông tin giao hàng
                </h2>
                
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    placeholder="Họ"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    placeholder="Tên"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Địa chỉ email"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    placeholder="Số điện thoại"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Location Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Select
                    placeholder="Chọn Tỉnh/Thành phố"
                    value={formData.province}
                    options={provinces}
                    onChange={handleProvinceChange}
                    className="w-full"
                    isSearchable
                    required
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '48px',
                        borderColor: '#D1D5DB',
                        '&:hover': { borderColor: '#3B82F6' }
                      })
                    }}
                  />

                  <Select
                    placeholder="Chọn Quận/Huyện"
                    value={formData.district}
                    options={districts}
                    onChange={handleDistrictChange}
                    className="w-full"
                    isSearchable
                    isDisabled={!formData.province}
                    required
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '48px',
                        borderColor: '#D1D5DB',
                        '&:hover': { borderColor: '#3B82F6' }
                      })
                    }}
                  />

                  <Select
                    placeholder="Chọn Phường/Xã"
                    value={formData.commune}
                    options={communes}
                    onChange={handleCommuneChange}
                    className="w-full"
                    isSearchable
                    isDisabled={!formData.district}
                    required
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '48px',
                        borderColor: '#D1D5DB',
                        '&:hover': { borderColor: '#3B82F6' }
                      })
                    }}
                  />
                </div>

                {/* Detailed Address */}
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  placeholder="Số nhà, tên đường"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  required
                />

                {/* Payment Method */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Phương thức thanh toán
                  </h3>
                  <div
                    onClick={() => setMethod("cod")}
                    className={`flex items-center gap-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      method === "cod" 
                        ? "border-green-500 bg-green-50" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                        method === "cod" ? "border-green-500" : "border-gray-300"
                      }`}
                    >
                      {method === "cod" && (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-gray-700 font-medium">
                      Thanh toán khi nhận hàng (COD)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Đơn hàng của bạn
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cartData.length > 0 ? (
                    cartData.map((item, index) => {
                      const productData = products.find(
                        (product) => product._id === item._id
                      );
                      
                      if (!productData) return null;

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
                        >
                          <img
                            className="w-16 h-16 object-cover rounded-md"
                            src={getImageUrl(productData.images?.[0])}
                            alt={productData.name}
                            onError={(e) => {
                              e.target.src = "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {productData.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Size: {item.size}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {productData.price} {currency}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 1;
                                updateQuantity(item._id, item.size, newQuantity);
                              }}
                              className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Giỏ hàng trống</p>
                    </div>
                  )}
                </div>

                {/* Order Total */}
                <div className="border-t border-gray-200 pt-4">
                  <CartTotal />
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    loading || cartData.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={loading || cartData.length === 0}
                >
                  {loading ? "Đang xử lý..." : "ĐẶT HÀNG"}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Bằng việc đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
