import { db } from "@/lib/db";

interface DeleteProductInput {
  id: string;
}

export async function deleteProduct(input: DeleteProductInput) {
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

    // Delete the product
    await db.product.delete({
      where: { id: input.id },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
}
