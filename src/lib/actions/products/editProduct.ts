import { db } from "@/lib/db";

interface EditProductInput {
  id: string;
  name?: string;
  serialNumber?: string;
  description?: string;
}

export async function editProduct(input: EditProductInput) {
  try {
    // First check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: input.id },
    });

    if (!existingProduct) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    // If serialNumber is being updated, check for uniqueness
    if (
      input.serialNumber &&
      input.serialNumber !== existingProduct.serialNumber
    ) {
      const duplicateProduct = await db.product.findUnique({
        where: { serialNumber: input.serialNumber },
      });

      if (duplicateProduct) {
        return {
          success: false,
          error: "A product with this serial number already exists",
        };
      }
    }

    // Update the product
    const updatedProduct = await db.product.update({
      where: { id: input.id },
      data: {
        name: input.name,
        serialNumber: input.serialNumber,
        description: input.description,
      },
    });

    return { success: true, data: updatedProduct };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
}
