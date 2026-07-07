import React, { useEffect, useState } from 'react'
import { FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom' // 1. Import the hook
import axios from 'axios';
import {api} from "../../services/api";

const Post = () => {
  const [products, setSaifulRehman] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  
  const navigate = useNavigate(); // 2. Initialize navigate

  useEffect(() => {
    const fetchPanda = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${api}/products`
        );
        if (!res.data) throw new Error('Failed to fetch products');
        setSaifulRehman(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPanda();
  }, []);
  if (loading) return <p className="text-center p-10 text-gray-500">Loading...</p>;
  if (error)   return <p className="text-center p-10 text-red-500">Error: {error}</p>;
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this product?`
    );
    if (confirmDelete) {
      try {
        const res = await axios.delete(`${api}/products/${productId}`);
        if (!res.data) throw new Error('Failed to delete product');
        setSaifulRehman(products.filter((p) => p._id !== productId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 bg-gray-50 min-h-screen">
      {products.map((product) => (
        <div 
          key={product._id} 
          onClick={() => navigate(`/products/${product._id}`)} // 3. Add onClick handler to redirect
          className="flex flex-col gap-3 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" // 4. Added 'cursor-pointer'
        >
          <span className="text-xs font-bold text-gray-400 tracking-wider">
            #{product._id}
          </span>
          <h2 className="text-lg font-semibold text-gray-800 capitalize line-clamp-2">
            {product.name}
          </h2>
          <h3 className="text-sm text-gray-600 leading-relaxed line-clamp-4">
            ${product.price.toFixed(2)}
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
            {product.description}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from propagating to the parent div
              handleDelete(product._id);
            }}
        
          >
            <h2 className="text-sm font-semibold text-red-500">Delete</h2>
          </button>
          

        </div>
      ))}
    </div>
  );
}

export default Post;