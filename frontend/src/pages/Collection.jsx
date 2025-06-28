import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, setSearch, showSearch, loading } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]); 
  const [sortType, setSortType] = useState("relevant");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

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
    console.log("Applying filters with:", { 
      totalProducts: products.length, 
      category, 
      subCategory, 
      search, 
      showSearch, 
      priceRange 
    });
    
    let productsCopy = products.slice();
    
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      console.log("After search filter:", productsCopy.length);
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
      console.log("After category filter:", productsCopy.length);
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
      console.log("After subcategory filter:", productsCopy.length);
    }

    // Apply price range filter only if price exists
    productsCopy = productsCopy.filter((item) => {
      const price = Number(item.price);
      return price >= priceRange.min && price <= priceRange.max;
    });
    console.log("After price filter:", productsCopy.length, "Price range:", priceRange);
    
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
    console.log("Products changed:", products.length);
    if (products.length > 0) {
      applyFilter();
    }
  }, [category, subCategory, search, showSearch, products, priceRange]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  // Show message if no products available
  if (!loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">No products available</div>
      </div>
    );
  }

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
                placeholder="Min"
                className="w-20 p-1 border border-gray-300 rounded"
                value={priceRange.min || ""}
                onChange={(e) =>
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
                placeholder="Max"
                className="w-20 p-1 border border-gray-300 rounded"
                value={priceRange.max || ""}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    max: e.target.value ? Number(e.target.value) : 1000000,
                  })
                }
                max={1000000}
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

        {/* Debug Info */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filterProducts.length} of {products.length} products
        </div>

        {/* Display Products */}
        {filterProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
            {filterProducts.map((item, index) => (
              <ProductItem
                key={item._id || index}
                id={item._id}
                image={item.images}
                name={item.name}
                price={item.price}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No products found matching your criteria</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
