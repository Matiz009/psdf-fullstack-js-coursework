import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {api} from "../../services/api";

const PostCard = ({ product, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      `Delete "${product.name}"?`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${product._id}`);

      onDelete(product._id);
    } catch (error) {
      alert("Failed to delete product.");
      console.error(error);
    }
  };

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <button
        onClick={handleDelete}
        className="absolute right-3 top-3 z-10 rounded-full bg-red-500 p-2 text-white opacity-0 transition-all duration-300 hover:bg-red-600 group-hover:opacity-100"
      >
        <FaTrash size={14} />
      </button>

      <img
        src={product.image}
        alt={product.name}
        className="h-56 w-full object-cover"
      />

      <div className="space-y-2 p-5">
        <h2 className="text-xl font-bold text-gray-800">
          {product.name}
        </h2>

        <p className="line-clamp-2 text-gray-500">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price}
          </span>

          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;