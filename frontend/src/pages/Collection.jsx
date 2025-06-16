import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, setSearch, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  const toggleCategory = (e) => {
    setCategory((prev) =>
      prev.includes(e.target.value)
        ? prev.filter((item) => item !== e.target.value)
        : [...prev, e.target.value]
    );
  };

  const toggleSubCategory = (e) => {
    setSubCategory((prev) =>
      prev.includes(e.target.value)
        ? prev.filter((item) => item !== e.target.value)
        : [...prev, e.target.value]
    );
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Apply price range filter
    productsCopy = productsCopy.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max
    );

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, priceRange]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col md:flex-row gap-5 pt-10 border-t px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* Filters Section */}
      <div className="w-full md:w-2/6 lg:w-1/4 xl:w-1/5 border-r border-gray-300 pr-5">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="text-lg font-semibold cursor-pointer flex items-center justify-between"
        >
          FILTERS
          <img
            className={`h-4 md:hidden transition-transform ${
              showFilter ? "rotate-90" : ""
            }`}
            src={assets.dropdown_icon}
            alt="dropdown"
            loading="lazy"
          />
        </p>

        <div className={`${showFilter ? "" : "hidden"} md:block`}>
          {/* Category Filter */}
          <div className="mt-4 border-b pb-3">
            <p className="text-sm font-medium">CATEGORIES</p>
            <div className="mt-2 flex flex-col space-y-2 text-sm text-gray-700">
              {["Men", "Women", "Kids"].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    value={item}
                    onChange={toggleCategory}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* Subcategory Filter */}
          <div className="mt-4 border-b pb-3">
            <p className="text-sm font-medium">TYPE</p>
            <div className="mt-2 flex flex-col space-y-2 text-sm text-gray-700">
              {["Topwear", "Bottomwear", "Winterwear"].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    value={item}
                    onChange={toggleSubCategory}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mt-4">
            <p className="text-sm font-medium">PRICE RANGE</p>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="number"
                className="w-20 p-1 border border-gray-300 rounded"
                value={priceRange.min}
                onFocus={(e) => (e.target.value = "")}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    min: e.target.value ? Number(e.target.value) : 0,
                  })
                }
                onBlur={(e) =>
                  setPriceRange({
                    ...priceRange,
                    min: e.target.value ? Number(e.target.value) : 0,
                  })
                }
                min={0}
              />
              <span>-</span>
              <input
                type="number"
                className="w-20 p-1 border border-gray-300 rounded"
                value={priceRange.max}
                onFocus={(e) => (e.target.value = "")}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    max: e.target.value ? Number(e.target.value) : 10000,
                  })
                }
                onBlur={(e) =>
                  setPriceRange({
                    ...priceRange,
                    max: e.target.value ? Number(e.target.value) : 10000,
                  })
                }
                max={10000}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex-1 pl-0 sm:pl-5">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 mt-5 sm:mt-0">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          {/* Sorting Dropdown */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 bg-white text-sm px-3 py-2 rounded-md shadow-sm focus:border-blue-500 hover:bg-gray-100 transition duration-200 mb-2 sm:mb-0"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Display Products */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
