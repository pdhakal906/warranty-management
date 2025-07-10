import { db } from "@/lib/db";

interface AddProductInput {
  name: string;
  serialNumber?: string;
  serialNumbers: string[];
  description?: string;
}

export async function addProduct(input: AddProductInput) {
  if (!input.serialNumbers || input.serialNumbers.length === 0) {
    return { success: false, error: "Serial numbers are required" };
  }
  try {
    const product = await db.product.create({
      data: {
        name: input.name,
        serialNumber: "1234567891234567",
       serialNumbers: serial
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
