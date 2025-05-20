import { db } from "@/lib/db";

interface GetCustomersInput {
  skip?: number;
  limit?: number;
}

interface GetCustomersResponse {
  success: boolean;
  data?: {
    customers: Awaited<ReturnType<typeof db.customer.findMany>>;
    total: number;
  };
  error?: string;
}

export async function getCustomers({
  skip = 0,
  limit = 10,
}: GetCustomersInput = {}): Promise<GetCustomersResponse> {
  try {
    // Get total count of customers
    const total = await db.customer.count();

    // Fetch customers with pagination
    const customers = await db.customer.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: {
        customers,
        total,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "An unknown error occurred",
    };
  }
}
