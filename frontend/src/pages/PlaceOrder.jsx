import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../context/Shopcontext";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    navigate,
    loading,
    setLoading,
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
    
    // Validate location selection
    if (!formData.province || !formData.district || !formData.commune) {
      toast.error("Vui lòng chọn đầy đủ địa chỉ (Tỉnh/Thành phố, Quận/Huyện, Phường/Xã)");
      return;
    }

    setLoading(true);

    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
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
            `${backendUrl}/api/order/place-order`,
            orderData,
            {
              headers: { token: token },
            }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [location.pathname]);

  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"
      >
        {/* Left Side - Delivery Information */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"THÔNG TIN"} text2={"VẬN CHUYỂN"} />
          </div>
          
          {/* Personal Information */}
          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              placeholder="Họ"
              onChange={handleChange}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-blue-600"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              placeholder="Tên"
              onChange={handleChange}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          {/* Contact Information */}
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Địa chỉ email"
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-blue-600"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            placeholder="Số điện thoại"
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-blue-600"
            required
          />

          {/* Location Selection */}
          <Select
            placeholder="Chọn Tỉnh/Thành phố"
            value={formData.province}
            options={provinces}
            onChange={handleProvinceChange}
            className="w-full"
            isSearchable
            required
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
          />

          {/* Detailed Address */}
          <input
            type="text"
            name="address"
            value={formData.address}
            placeholder="Số nhà, tên đường"
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full focus:outline-none focus:border-blue-600"
            required
          />
        </div>

        {/* Right Side - Payment Method */}
        <div className="mt-8">
          <CartTotal />
          <div className="mt-12">
            <Title text1={"PHƯƠNG THỨC"} text2={"THANH TOÁN"} />
            <div className="flex justify-center">
              <div
                onClick={() => setMethod("cod")}
                className={`flex items-center gap-2 border border-gray-300 p-3 px-4 cursor-pointer rounded-md w-full max-w-md ${
                  method === "cod" && "bg-gray-100 border-gray-400"
                }`}
              >
                <p
                  className={`w-4 h-4 border border-gray-300 rounded-full ${
                    method === "cod" ? "bg-green-500" : ""
                  }`}
                ></p>
                <p className="text-gray-700 text-sm font-medium">
                  Thanh toán khi nhận hàng
                </p>
              </div>
            </div>

            <div className="w-full text-center mt-8">
              <button
                type="submit"
                className="text-white px-16 py-3 text-sm disabled:opacity-50 bg-green-700 hover:bg-green-800 rounded-md"
                disabled={loading}
              >
                ĐẶT HÀNG
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
