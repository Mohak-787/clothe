import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MoreHorizontal, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Product, fetchProducts } from "@shared/api";

const getStatusColor = (status: string) => {
  switch (status) {
    case "in-stock":
      return "bg-green-100 text-green-800";
    case "low-stock":
      return "bg-yellow-100 text-yellow-800";
    case "out-of-stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "in-stock":
      return "In Stock";
    case "low-stock":
      return "Low Stock";
    case "out-of-stock":
      return "Out of Stock";
    default:
      return status;
  }
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((error) => console.error('Failed to fetch products:', error));
  }, []);

  return (
    case "in-stock":
      return "In Stock";
    case "low-stock":
      return "Low Stock";
    case "out-of-stock":
      return "Out of Stock";
  }
};

export default function Products() {
  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Product Management"
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Products" },
        ]}
      />

      <div className="flex-1 overflow-auto bg-gray-50 p-8">
        {/* Top Actions */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by product name or SKU..."
                className="pl-10 bg-white border-gray-200"
              />
            </div>
            <button className="p-2 hover:bg-gray-200 rounded-lg">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-lg">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <Button
            className="bg-[#c9a876] hover:bg-[#b89860] text-white rounded-lg font-medium"
          >
            + Add Product
          </Button>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6">
          Manage your clothing catalog, variants, and inventory
        </p>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {getStatusLabel(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
