import { db } from "@/lib/db";

interface EditSaleInput {
  id: string;
  customerId?: string;
  dateOfPurchase?: Date;
  productIds?: string[];
}

export async function editSale(input: EditSaleInput) {
  try {
    // First check if sale exists
    const existingSale = await db.sale.findUnique({
      where: { id: input.id },
      include: {
        products: true,
      },
    });

    if (!existingSale) {
      return {
        success: false,
        error: "Sale not found",
      };
    }

    // If customerId is provided, check if customer exists
    if (input.customerId) {
      const customer = await db.customer.findUnique({
        where: { id: input.customerId },
      });

      if (!customer) {
        return {
          success: false,
          error: "Customer not found",
        };
      }
    }

    // If productIds are provided, check if all products exist and are not sold
    if (input.productIds) {
      const products = await db.product.findMany({
        where: {
          id: { in: input.productIds },
          OR: [
            { saleId: null }, // Not sold
            { saleId: input.id }, // Already part of this sale
          ],
        },
      });

      if (products.length !== input.productIds.length) {
        return {
          success: false,
          error:
            "One or more products not found or already sold in another sale",
        };
      }
    }

    // Update the sale and products in a transaction
    const updatedSale = await db.$transaction(async (tx) => {
      // Update the sale
      const sale = await tx.sale.update({
        where: { id: input.id },
        data: {
          customerId: input.customerId,
          dateOfPurchase: input.dateOfPurchase,
        },
      });

      // If productIds are provided, update product associations
      if (input.productIds) {
        // Remove saleId from products that are no longer part of this sale
        await tx.product.updateMany({
          where: {
            saleId: input.id,
            id: { notIn: input.productIds },
          },
          data: {
            saleId: null,
          },
        });

        // Add saleId to new products
        await tx.product.updateMany({
          where: {
            id: { in: input.productIds },
            saleId: null,
          },
          data: {
            saleId: input.id,
          },
        });
      }

      return sale;
    });

    return { success: true, data: updatedSale };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
}
