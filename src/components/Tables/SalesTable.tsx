'use client';

import { Button, Table, Group, Loader, Center } from '@mantine/core';
import { useState } from 'react';
import { CustomDrawer } from '../CustomDrawer';
import { notifications } from '@mantine/notifications';
import useSWR from 'swr';
import { UpdateSaleForm } from '../Forms/UpdateSaleForm';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Product {
  id: string;
  name: string;
  serialNumber: string;
}

interface Customer {
  id: string;
  name: string;
}

interface Sale {
  id: string;
  customerId: string;
  dateOfPurchase: Date;
  customer: Customer;
  products: Product[];
}

export const SalesTable = () => {
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const { data, error, isLoading, mutate } = useSWR<{ data: { sales: Sale[] } }>('/api/sales', fetcher);

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setEditFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sale?')) {
      return;
    }

    try {
      const response = await fetch(`/api/sales/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Sale deleted successfully',
          color: 'green',
        });
        mutate();
      } else {
        const data = await response.json();
        notifications.show({
          title: 'Error',
          message: data.error || 'Failed to delete sale',
          color: 'red',
        });
      }
    } catch {
      notifications.show({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <div>Error loading sales</div>
      </Center>
    );
  }

  const sales = data?.data?.sales || [];

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Date of Purchase</Table.Th>
            <Table.Th>Products</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sales.map((sale) => (
            <Table.Tr key={sale.id}>
              <Table.Td>{sale.customer.name}</Table.Td>
              <Table.Td>{new Date(sale.dateOfPurchase).toLocaleDateString()}</Table.Td>
              <Table.Td>
                {sale.products.map((product) => (
                  <div key={product.id}>
                    {product.name} ({product.serialNumber})
                  </div>
                ))}
              </Table.Td>
              <Table.Td>
                <Group gap="sm">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleEdit(sale)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    color="red"
                    size="xs"
                    onClick={() => handleDelete(sale.id)}
                  >
                    Delete
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <CustomDrawer
        opened={editFormOpen}
        onClose={() => {
          setEditFormOpen(false);
          setSelectedSale(null);
        }}
        title="Edit Sale"
      >
        {selectedSale && (
          <UpdateSaleForm
            sale={selectedSale}
            onSuccess={() => {
              mutate();
              setEditFormOpen(false);
              setSelectedSale(null);
            }}
            onClose={() => {
              setEditFormOpen(false);
              setSelectedSale(null);
            }}
          />
        )}
      </CustomDrawer>
    </>
  );
}; 