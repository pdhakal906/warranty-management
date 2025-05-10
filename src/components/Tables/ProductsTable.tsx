import { Button, Table, Group, Loader, Center } from '@mantine/core';
import React, { useState } from 'react'
import { CustomDrawer } from '../CustomDrawer';
import { UpdateProductForm } from '../Forms/UpdateProductForm';
import useSWR from 'swr';
import { notifications } from '@mantine/notifications';

interface Product {
  id: string;
  name: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ProductsTable = () => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data, error, isLoading, mutate } = useSWR('/api/products', fetcher);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditFormOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditFormOpen(false);
    setSelectedProduct(null);
    // Trigger revalidation of the products data
    mutate();
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      notifications.show({
        title: 'Success',
        message: 'Product deleted successfully',
        color: 'green',
      });
      // Trigger revalidation of the products data
      mutate();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete product',
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return <Center><Loader ></Loader></Center>;
  }

  if (error) {
    return <div>Error loading products</div>;
  }

  const products = data?.data?.products || [];

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Serial Number</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {products.map((product: Product) => (
            <Table.Tr key={product.id}>
              <Table.Td>{product.name}</Table.Td>
              <Table.Td>{product.serialNumber}</Table.Td>
              <Table.Td>{product.description}</Table.Td>
              <Table.Td>
                <Group>
                  <Button variant="outline" size="xs" onClick={() => handleEdit(product)}>
                    Edit
                  </Button>
                  <Button variant="outline" color="red" size="xs" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <CustomDrawer
        opened={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        title="Edit Product"
        size="md"
      >
        {selectedProduct && (
          <UpdateProductForm
            initialValues={selectedProduct}
            onSuccess={handleEditSuccess}
            onClose={() => setIsEditFormOpen(false)}
          />
        )}
      </CustomDrawer>
    </>
  );
}

export default ProductsTable
