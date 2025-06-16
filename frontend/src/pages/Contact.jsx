import React from "react";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="text-center text-2xl pt-10 border-t ">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        {/* Contact Image */}
        <div className="flex justify-center items-center">
          <img
            src={assets.contact_img}
            alt="Contact"
            className="w-full sm:max-w-[400px]"
            loading="lazy"
          />
        </div>

        {/* Contact Details */}
        <div className="flex flex-col justify-center items-start gap-3">
          <p className="font-semibold text-3xl text-gray-600">AllWear</p>

          <p className="text-gray-500 flex items-start gap-2">
            <FaMapMarkerAlt className="text-blue-500 mt-1.5" />
            <span>
              B, Tòa nhà A, Khu phố 6,
              <br /> P. Tân Bình, Q. Bình Tân,
              <br /> TP. Hồ Chí Minh
            </span>
          </p>

          <p className="text-gray-500 flex items-center gap-2">
            <FaPhoneAlt className="text-blue-500" />
            <a href="tel:+84-9090909090" className="hover:text-blue-500">
              +84-9090909090
            </a>
          </p>

          <p className="text-gray-500 flex items-center gap-2">
            <FaEnvelope className="text-blue-500" />
            <a
              href="mailto:phuongaz@gmail.com"
              className="hover:text-blue-500"
            >
              phuongaz@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
