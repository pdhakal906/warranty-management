import { db } from "@/lib/db";

interface AddCustomerInput {
  name: string;
  description?: string;
}

export async function addCustomer(input: AddCustomerInput) {
  try {
    const customer = await db.customer.create({
      data: {
        name: input.name,
        description: input.description,
      },
    });

    return { success: true, data: customer };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
}
