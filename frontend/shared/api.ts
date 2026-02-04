/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Product interface
 */
export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  status: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch products from backend
 */
export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/v1/admin/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

/**
 * Create a new product
 */
export async function createProduct(product: { name: string; price: number; description: string; status: string; image?: File }): Promise<Product> {
  const formData = new FormData();
  formData.append('name', product.name);
  formData.append('price', product.price.toString());
  formData.append('description', product.description);
  formData.append('status', product.status);
  if (product.image) {
    formData.append('image', product.image);
  }

  const response = await fetch('/api/v1/admin/products', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  return response.json();
}

/**
 * Update a product
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const response = await fetch(`/api/v1/admin/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  return response.json();
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/v1/admin/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
}
