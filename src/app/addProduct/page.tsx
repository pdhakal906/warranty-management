// import { getProducts } from "@/lib/data/getProduct";
import { Button, Stack, TextInput } from "@mantine/core";

export default async function AddPage() {
  // const skip = 0
  // const limit = 100
  // const result = await getProducts({ skip, limit });
  // const products = result.data?.products
  return (
    <div>
      <Stack>
        <TextInput label='Serial Number' />

        <Button variant="outline" className="border-blue-500">Ok</Button>
        <Button variant={'outline'} c={'green'} className="border-red-500">Save</Button>
      </Stack>
    </div>
  );
}
