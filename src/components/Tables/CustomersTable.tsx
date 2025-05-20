import { Button, Table, Group, Loader, Center } from '@mantine/core';
import React, { useState } from 'react'
import { CustomDrawer } from '../CustomDrawer';
import useSWR from 'swr';
import { notifications } from '@mantine/notifications';
import { UpdateCustomerForm } from '../Forms/UpdateCustomerForm';

interface Customer {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CustomersTable = () => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { data, error, isLoading, mutate } = useSWR('/api/customers', fetcher);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditFormOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditFormOpen(false);
    setSelectedCustomer(null);
    // Trigger revalidation of the customers data
    mutate();
  };

  const handleDelete = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      const response = await fetch('/api/customers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: customerId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete customer');
      }

      notifications.show({
        title: 'Success',
        message: 'Customer deleted successfully',
        color: 'green',
      });
      // Trigger revalidation of the customers data
      mutate();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete customer',
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return <Center><Loader /></Center>;
  }

  if (error) {
    return <div>Error loading customers</div>;
  }

  const customers = data?.data?.customers || [];

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {customers.map((customer: Customer) => (
            <Table.Tr key={customer.id}>
              <Table.Td>{customer.name}</Table.Td>
              <Table.Td>{customer.description}</Table.Td>
              <Table.Td>
                <Group>
                  <Button variant="outline" size="xs" onClick={() => handleEdit(customer)}>
                    Edit
                  </Button>
                  <Button variant="outline" color="red" size="xs" onClick={() => handleDelete(customer.id)}>
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
        title="Edit Customer"
        size="md"
      >
        {selectedCustomer && (
          <UpdateCustomerForm
            initialValues={selectedCustomer}
            onSuccess={handleEditSuccess}
            onClose={() => setIsEditFormOpen(false)}
          />
        )}
      </CustomDrawer>
    </>
  );
}

export default CustomersTable; 