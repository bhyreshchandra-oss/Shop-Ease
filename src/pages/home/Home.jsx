import React, { useState } from "react";
import bg from "../../assets/bg0.gif";
import "./Home.css";
import { category } from "../../assets/Category";
import Product from "../../components/ProductCard/ProductCard";
import { dummydata } from "../../assets/dummydata";

function Home() {
  let [cate, setCate] = useState(dummydata);

  function filterProducts(categoryName) {
    const updatedata = dummydata.filter(
      (item) => item.category === categoryName,
    );
    setCate(updatedata);
  }

  return (
    <div className="home">
      <div className="hero-bg">
        <img src={bg} alt="" />
      </div>

      <div className="category-section">
        {category.slice(0, 5).map((item) => (
          <div
            className="category-card"
            onClick={() => {
              filterProducts(item.name);
            }}
          >
            <img src={item.image} alt={item.name} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      <h1>Trending Products</h1>

      <div className="product-section">
        {cate.slice(0, 6).map((item) => (
          <Product name={item.name} price={item.price} image={item.image} />
        ))}
      </div>
    </div>
  );
}

export default Home;
