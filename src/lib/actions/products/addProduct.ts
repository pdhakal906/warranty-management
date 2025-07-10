import { db } from "@/lib/db";

interface AddProductInput {
  name: string;
  serialNumbers: string[];
  description?: string;
}

export async function addProduct(input: AddProductInput) {
  if (!input.serialNumbers || input.serialNumbers.length === 0) {
    return { success: false, error: "Serial numbers are required" };
  }

  try {
    const result = await db.$transaction(async (tx) => {
      // Create the product
      const product = await tx.product.create({
        data: {
          name: input.name,
          serialNumbers: {
            create: input.serialNumbers.map((indvSerialNumber) => ({
              number: indvSerialNumber.trim(),
            })),
          },
          description: input.description,
        },
        include: { serialNumbers: true }, // Needed for next step
      });

      // --- Inline logic of handleNewProductCreation ---
      const serialNumbers = product.serialNumbers.map((sn) => sn.number);

      const serialNumberTemps = await tx.serialNumberTemp.findMany({
        where: {
          number: { in: serialNumbers },
        },
        select: {
          id: true,
          productTempId: true,
        },
      });

      const serialNumberTempIds = serialNumberTemps.map((snt) => snt.id);
      const productTempIds = [
        ...new Set(serialNumberTemps.map((snt) => snt.productTempId)),
      ];

      await tx.serialNumberTemp.deleteMany({
        where: {
          id: { in: serialNumberTempIds },
        },
      });

      await tx.productTemp.deleteMany({
        where: {
          id: { in: productTempIds },
        },
      });

      return product;
    });

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof Error) {
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
