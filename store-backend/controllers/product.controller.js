import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products ORDER BY created_at DESC
    `;

    res.status(200).json({
      message: "Products successfully fetched",
      data: products,
      success: true
    });

  } catch (error) {
    console.error("Error in getProducts controller: ", error);
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
      success: false
    });
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    const newProduct = await sql`
      INSERT INTO products (name, price, image)
      VALUES (${name}, ${price}, ${image})
      RETURNING *
    `;

    res.status(201).json({
      message: "New product successfully created",
      data: newProduct[0],
      success: true
    });

  } catch (error) {
    console.error("Error in createProduct controller: ", error);
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
      success: false
    });
  }
}

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await sql`
      SELECT * FROM products WHERE id=${id}
    `;

    res.status(201).json({
      message: "Product successfully fetched",
      data: product[0],
      success: true
    });

  } catch (error) {
    console.error("Error in getProduct controller: ", error);
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
      success: false
    });
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image } = req.body;

    const updatedProduct = await sql`
      UPDATE products 
      SET name=${name}, price=${price}, image=${image}
      WHERE id=${id}
      RETURNING *
    `;

    if (updatedProduct.length === 0) {
      return res.status(404).json({
        message: "Product not found",
        success: false
      });
    }

    res.status(201).json({
      message: "Product successfully updated",
      data: updatedProduct[0],
      success: true
    });

  } catch (error) {
    console.error("Error in updateProduct controller: ", error);
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
      success: false
    });
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await sql`
      DELETE FROM products
      WHERE id=${id}
      RETURNING *
    `;

    if (deletedProduct.length === 0) {
      return res.status(404).json({
        message: "Product not found",
        success: false
      });
    }

    res.status(201).json({
      message: "Product successfully deleted",
      data: deletedProduct[0],
      success: true
    });

  } catch (error) {
    console.error("Error in deleteProduct controller: ", error);
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
      success: false
    });
  }
}