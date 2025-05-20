import { db } from "@/lib/db";

interface GetSalesInput {
  skip?: number;
  limit?: number;
}

interface GetSalesResponse {
  success: boolean;
  data?: {
    sales: Awaited<ReturnType<typeof db.sale.findMany>>;
    total: number;
  };
  error?: string;
}

export async function getSales({
  skip = 0,
  limit = 10,
}: GetSalesInput = {}): Promise<GetSalesResponse> {
  try {
    // Get total count of sales
    const total = await db.sale.count();

    // Fetch sales with pagination and include related data
    const sales = await db.sale.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: true,
        products: true,
      },
    });

    return {
      success: true,
      data: {
        sales,
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
