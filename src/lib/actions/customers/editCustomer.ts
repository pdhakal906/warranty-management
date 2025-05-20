import { db } from "@/lib/db";

interface EditCustomerInput {
  id: string;
  name?: string;
  description?: string;
}

export async function editCustomer(input: EditCustomerInput) {
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

    // Update the customer
    const updatedCustomer = await db.customer.update({
      where: { id: input.id },
      data: {
        name: input.name,
        description: input.description,
      },
    });

    return { success: true, data: updatedCustomer };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
}
