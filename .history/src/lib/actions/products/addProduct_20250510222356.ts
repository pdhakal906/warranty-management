import { db } from "@/lib/db";

interface AddProductInput {
  name: string;
  serialNumber: string;
  description?: string;
}

export async function addProduct(input: AddProductInput) {
  try {
    const product = await db.product.create({
      data: {
        name: input.name,
        serialNumber: input.serialNumber,
        description: input.description,
      },
    });

    return { success: true, data: product };
  } catch (error) {
    if (error instanceof Error) {
      // Handle unique constraint violation for serialNumber
      if (error.message.includes("Unique constraint failed")) {
        return {
          success: false,
          error: "A product with this serial number already exists",
        };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
}
