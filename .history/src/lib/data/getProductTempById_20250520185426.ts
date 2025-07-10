import { db } from "@/lib/db";

interface GetProductByIdInput {
  id: string;
}

interface GetProductTempByIdResponse {
  success: boolean;
  data?: Awaited<ReturnType<typeof db.product.findUnique>>;
  error?: string;
}

export async function getProductTempById({
  id,
}: GetProductByIdInput): Promise<GetProductTempByIdResponse> {
  try {
    // Get total count of products
    const productTemp = await db.productTemp.findUnique({
      where: { id: id },
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
