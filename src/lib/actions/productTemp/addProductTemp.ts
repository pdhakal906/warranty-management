import { db } from "@/lib/db";

interface AddProductTempInput {
  name: string;
}

export async function addProductTemp(input: AddProductTempInput) {
  try {
    const productTemp = await db.productTemp.create({
      data: {
        name: input.name,
      },
    });

    return { success: true, data: productTemp };
  } catch (error) {
    console.log(error);
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
