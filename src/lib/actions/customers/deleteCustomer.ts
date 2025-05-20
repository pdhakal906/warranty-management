import { db } from "@/lib/db";

interface DeleteCustomerInput {
  id: string;
}

export async function deleteCustomer(input: DeleteCustomerInput) {
  try {
    // First check if customer exists
    const existingCustomer = await db.customer.findUnique({
      where: { id: input.id },
    });

    if (!existingCustomer) {
      return {
        success: false,
        error: "Customer not found",
      };
    }

    // Delete the customer
    await db.customer.delete({
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
