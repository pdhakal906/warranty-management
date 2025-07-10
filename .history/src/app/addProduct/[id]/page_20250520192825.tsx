// import { getProducts } from "@/lib/data/getProduct";
import { AddSerialNumberTempForm } from "@/components/Forms/AddSerialNumberTempForm";
export default async function AddPage(params: { params: { id: string } }) {
  const param = await params.params;
  console.log(param);
  // const skip = 0
  // const limit = 100
  // const result = await getProducts({ skip, limit });
  // const products = result.data?.products
  return (
    <div>
      <AddSerialNumberTempForm></AddSerialNumberTempForm>
    </div>
  );
}
