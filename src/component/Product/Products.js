import React, { Fragment, useEffect, useState, useMemo } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import WhyChooseUs from "../WhyChooseUs/WhyChooseUs";
import Testimonials from "../Testimonials/Testimonials";
import VisionMission from "../VisionMission/VisionMission";

const categories = [
  "all",
  "Education eBook",
  "eBook and Manual Book",
  "Vastu Product",
  "Numerology Product"
];

const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  // ✅ Optimized filtering with useMemo
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const lowerSearch = searchTerm.toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(lowerSearch) ||
        product.description.toLowerCase().includes(lowerSearch);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  return (
    <Fragment>
      <MetaData title="Products - Astro World" />

      {/* Banner - Always visible */}
      <div className="products-banner"></div>

      {/* Intro - Always visible */}
      <section className="products-intro">
        <h2>Our Products</h2>
        <div className="products-description">
          <p>
            Explore our carefully curated collection of astrological products designed to enhance your spiritual journey.
            Each product is crafted with precision and infused with positive energy to help you achieve harmony and balance in life.
            From powerful crystals to sacred yantras, our products are selected to support your spiritual growth and well-being.
          </p>
        </div>
      </section>

      {/* Filters - Always visible */}
      <section className="products-filters">
        <div className="filters-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-filter"
          />
        </div>
      </section>

      {/* Products showcase - Loader only here */}
      <section className="products-showcase">
        <div className="products-container">
          {loading ? (
            <Loader />
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="no-products-message">
              <h3>Product Not Found</h3>
            </div>
          )}
        </div>
      </section>

      {/* Static sections */}
      <WhyChooseUs />
      <VisionMission />
      <Testimonials />
    </Fragment>
  );
};

export default Products;
