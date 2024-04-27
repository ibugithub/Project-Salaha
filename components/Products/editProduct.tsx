
import { useState } from "react";
import axios from "axios";
import { Product } from "./interface";
interface EditProductProps {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export const EditProduct = ({ product, onSave, onCancel }: EditProductProps) => {

  const [editedProd, setEditedProd] = useState({
    _id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    imgPath: product.image,
    imgFile: null as File | unknown 
  })

  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = `${process.env.NEXT_PUBLIC_baseApiUrl}/api/prod/edit/${editedProd._id}`
      const response = await axios.put(url, editedProd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onSave(response.data.product );
    } catch (err) {
      console.error("Error updating product", err);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedProd({ ...editedProd, [e.target.name]: e.target.value })
  }

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0]
    if (!selectedImage) {
      setError('Please choose a file')
      return;
    }
    setEditedProd({ ...editedProd, imgFile: selectedImage })
  }
  return (
    <>
      <form onSubmit={handleSubmit} className="py-5 flex flex-col gap-2 w-[250px] items-start">
        <span className="text-red-500">{error}</span>
        <input type="text" name="name" value={editedProd.name} placeholder="Product" onChange={handleChange} />
        <textarea cols={20} rows={2} name="description" value={editedProd.description} placeholder="Description" onChange={handleChange} />
        <input type="number" name="price" value={editedProd.price} placeholder="Price" onChange={handleChange} />
        <input type="number" name="quantity" value={editedProd.quantity} placeholder="Quantity" onChange={handleChange} />
        <input type="file" name="image" placeholder="Image" onChange={handleChangeImg} />
        <div className="flex gap-2">
          <button className="bg-blue-300 py-1 px-3" type="submit">Save</button>
          <button className="bg-red-300 py-1 px-3" type="button" onClick={onCancel}>Cancel</button>
        </div>

      </form>
    </>
  );
}