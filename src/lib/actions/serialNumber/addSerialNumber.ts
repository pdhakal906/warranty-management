import { db } from "@/lib/db";

interface AddSerialNumberInput {
  number: string;
  productTempId: string;
}

export async function addSerialNumberTemp(input: AddSerialNumberInput) {
  try {
    const serialNumberExists = await db.serialNumber.findUnique({
      where: { number: input.number },
    });
    if (serialNumberExists) {
      return {
        success: false,
        error: "A product with this serial number already exists",
      };
    }
    const serialNumber = await db.serialNumber.create({
      data: {
        number: input.number,
        productId: input.productTempId,
      },
    });

    return { success: true, data: serialNumber };
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
