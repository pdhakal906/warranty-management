import { addSerialNumberTemp } from "@/lib/actions/serialNumberTemp/addSerialNumberTemp";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await addSerialNumberTemp(body);

    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: `An unexpected error occurred:,${error} ` },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     // Get query parameters
//     const searchParams = request.nextUrl.searchParams;
//     const skip = parseInt(searchParams.get("skip") || "0");
//     const limit = parseInt(searchParams.get("limit") || "10");

//     // Validate parameters
//     if (isNaN(skip) || skip < 0) {
//       return NextResponse.json(
//         { success: false, error: "Invalid skip parameter" },
//         { status: 400 }
//       );
//     }

//     if (isNaN(limit) || limit < 1 || limit > 100) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Invalid limit parameter. Must be between 1 and 100",
//         },
//         { status: 400 }
//       );
//     }

//     // Get products with pagination
//     const result = await getProducts({ skip, limit });

//     if (!result.success) {
//       return NextResponse.json(
//         { success: false, error: result.error },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("Error in GET /api/products:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     const body = await request.json();

//     if (!body.id) {
//       return NextResponse.json(
//         { error: "Product ID is required" },
//         { status: 400 }
//       );
//     }

//     const result = await editProduct(body);

//     if (result.success) {
//       return NextResponse.json(result.data, { status: 200 });
//     } else {
//       return NextResponse.json({ error: result.error }, { status: 400 });
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { error: `An unexpected error occurred: ${error}` },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const body = await request.json();

//     if (!body.id) {
//       return NextResponse.json(
//         { error: "Product ID is required" },
//         { status: 400 }
//       );
//     }

//     const result = await deleteProduct(body);

//     if (result.success) {
//       return NextResponse.json({ success: true }, { status: 200 });
//     } else {
//       return NextResponse.json({ error: result.error }, { status: 400 });
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { error: `An unexpected error occurred: ${error}` },
//       { status: 500 }
//     );
//   }
// }
