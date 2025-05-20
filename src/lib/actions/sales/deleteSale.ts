import { db } from "@/lib/db";

interface DeleteSaleInput {
  id: string;
}

export async function deleteSale(input: DeleteSaleInput) {
  try {
    // First check if sale exists
    const existingSale = await db.sale.findUnique({
      where: { id: input.id },
    });

    if (!existingSale) {
      return {
        success: false,
        error: "Sale not found",
      };
    }

    // Delete the sale and update products in a transaction
    await db.$transaction(async (tx) => {
      // Remove saleId from all associated products
      await tx.product.updateMany({
        where: {
          saleId: input.id,
        },
        data: {
          saleId: null,
        },
      });

      // Delete the sale
      await tx.sale.delete({
        where: { id: input.id },
      });
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
}
