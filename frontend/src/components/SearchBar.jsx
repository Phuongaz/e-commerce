import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import { assets } from "../assets/frontend_assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  // search bar to be displayed only on collection page not on other pages
  useEffect(() => {
    if (location.pathname.includes("collection") ) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location])

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <img
          src={assets.search_icon}
          alt="search icon"
          className="w-4"
          loading="lazy"
        />
      </div>
      <img
        src={assets.cross_icon}
        alt="cross icon"
        className=" inline w-3 cursor-pointer"
        onClick={() => setShowSearch(false)}
        loading="lazy"
      />
    </div>
  ) : null;
};

export default SearchBar;
