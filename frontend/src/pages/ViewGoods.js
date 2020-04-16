import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000'

export default function ViewGoods() {
  const [products, setProducts] = useState([]);

  function loadContents() {
    console.log('loadContents');
    const currentRoute= window.location.pathname;
    var objId = currentRoute.replace("/viewgoods/","");  // remove "/viewgoods/"
    const url = `${API_URL}/products/${objId}`;

    axios.get(url).then(response => response.data)
      .then((data) => {
        setProducts(data);
        data.map(function (product) {
          console.log(product);
          return 1;
        });
      });
  }

  useEffect(() => {
    loadContents();
  }, []);

  return (
    <div >
      <React.Fragment>
        {products.map((card) => (
          <div key={card._id}>
            <div>_id: {card._id}</div>
            <div>title: {card.title}</div>
            <div>userId: {card.userId}</div>
            <div>price: {card.price}</div>
            <div>description: {card.description}</div>
            <div>image: {card.image}</div>
            <div>createdAt: {card.createdAt}</div>
            <div>
              <p></p>
            </div>  
          </div>        
        ))}
      </React.Fragment>
    </div>
  );
}
