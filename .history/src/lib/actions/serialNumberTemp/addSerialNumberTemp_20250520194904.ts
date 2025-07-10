import { db } from "@/lib/db";

interface AddSerialNumberTempInput {
  number: string;
  productTempId: string;
}

export async function addSerialNumberTemp(input: AddSerialNumberTempInput) {
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
    const serialNumberTemp = await db.serialNumberTemp.create({
      data: {
        number: input.number,
        productTempId: input.productTempId,
      },
    });

    return { success: true, data: serialNumberTemp };
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
