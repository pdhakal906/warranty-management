import { db } from "@/lib/db";

interface GetProductByIdInput {
  id: string;
}

interface GetProductsResponse {
  success: boolean;
  data?: {
    products: Awaited<ReturnType<typeof db.product.findMany>>;
    total: number;
  };
  error?: string;
}

export async function getProductTempById({
  id: string,
}: GetProductByIdInput): Promise<GetProductsResponse> {
  try {
    // Get total count of products
    const total = await db.product.count();

    // Fetch products with pagination
    const products = await db.product.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: {
        products,
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
