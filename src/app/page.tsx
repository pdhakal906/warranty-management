// import { getProducts } from "@/lib/data/getProduct";
import HomeComponent from "@/components/HomeComponent";
import { Text } from "@mantine/core";

export default async function Home() {
  // const skip = 0
  // const limit = 100
  // const result = await getProducts({ skip, limit });
  // const products = result.data?.products
  return (
    <div>
      <Text>Welcome to the RMA Management System</Text>
      <HomeComponent></HomeComponent>
    </div>
  );
}
