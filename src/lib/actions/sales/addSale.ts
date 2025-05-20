import { db } from "@/lib/db";

interface AddSaleInput {
  customerId: string;
  dateOfPurchase: Date;
  productIds: string[];
}

export async function addSale(input: AddSaleInput) {
  try {
    // First check if customer exists
    const customer = await db.customer.findUnique({
      where: { id: input.customerId },
    });

    if (!customer) {
      return {
        success: false,
        error: "Customer not found",
      };
    }

    // Check if all products exist and are not already sold
    const products = await db.product.findMany({
      where: {
        id: { in: input.productIds },
        saleId: null, // Only get products that are not sold
      },
    });

    if (products.length !== input.productIds.length) {
      return {
        success: false,
        error: "One or more products not found or already sold",
      };
    }

    // Create the sale and update products in a transaction
    const sale = await db.$transaction(async (tx) => {
      // Create the sale
      const newSale = await tx.sale.create({
        data: {
          customerId: input.customerId,
          dateOfPurchase: input.dateOfPurchase,
        },
      });

      // Update all products to link them to this sale
      await tx.product.updateMany({
        where: {
          id: { in: input.productIds },
        },
        data: {
          saleId: newSale.id,
        },
      });

      return newSale;
    });

    return { success: true, data: sale };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
}
