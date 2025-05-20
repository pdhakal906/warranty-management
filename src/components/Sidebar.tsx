'use client'
import { Box, Button, Flex, Stack } from '@mantine/core'
import React, { useState } from 'react'
import { CustomDrawer } from './CustomDrawer';
import ProductsTable from './Tables/ProductsTable';
import { AddProductForm } from './Forms/AddProductForm';
import CustomersTable from './Tables/CustomersTable';
import { AddCustomerForm } from './Forms/AddCustomerForm';
import { SalesTable } from './Tables/SalesTable';
import { AddSaleForm } from './Forms/AddSaleForm';

const Sidebar = () => {
  const [isAddProductFormOpen, setIsAddProductFormOpen] = useState(false);
  const [isViewProductsOpen, setIsViewProductsOpen] = useState(false);
  const [isAddCustomerFormOpen, setIsAddCustomerFormOpen] = useState(false);
  const [isViewCustomersOpen, setIsViewCustomersOpen] = useState(false);
  const [isAddSaleFormOpen, setIsAddSaleFormOpen] = useState(false);
  const [isViewSalesOpen, setIsViewSalesOpen] = useState(false);

  const handleAddProductSuccess = () => {
    setIsAddProductFormOpen(false);
  };

  const handleAddCustomerSuccess = () => {
    setIsAddCustomerFormOpen(false);
  };

  const handleAddSaleSuccess = () => {
    setIsAddSaleFormOpen(false);
  };

  return (
    <>
      <Box h={'100vh'} bg='gray.1' p={10}>
        <Stack gap={0}>
          <Button variant='subtle' p={10} fw={500} c={'red'}>Product</Button>
          <Flex p={0} justify={'right'}>
            <Button variant='subtle' p={10} fw={500} c={'blue'} onClick={() => setIsAddProductFormOpen(true)} >Add</Button>
          </Flex>
          <Flex p={0} justify={'right'}>
            <Button variant='subtle' p={10} fw={500} c={'blue'} onClick={() => setIsViewProductsOpen(true)}>List</Button>
          </Flex>
          <Button variant='subtle' p={10} fw={500} c={'red'}>Customer</Button>
          <Flex p={0} justify={'right'}>
            <Button variant='subtle' p={10} fw={500} c={'blue'} onClick={() => setIsAddCustomerFormOpen(true)}>Add</Button>
          </Flex>
          <Flex p={0} justify={'right'}>
            <Button variant='subtle' p={10} fw={500} c={'blue'} onClick={() => setIsViewCustomersOpen(true)}>List</Button>
          </Flex>
          <Button variant='subtle' p={10} fw={500} c={'green'}>Sales</Button>
          <Flex p={0} justify={'right'}>
            <Button variant='subtle' p={10} fw={500} c={'blue'} onClick={() => setIsAddSaleFormOpen(true)}>Add</Button>
          </Flex>
          <Flex p={0} justify={'right'}>
            <Button variant='subtle' p={10} fw={500} c={'blue'} onClick={() => setIsViewSalesOpen(true)}>List</Button>
          </Flex>
        </Stack>
      </Box>

      {/* Product Drawers */}
      <CustomDrawer
        opened={isAddProductFormOpen}
        onClose={() => setIsAddProductFormOpen(false)}
        title="Add Product"
        size="md"
      >
        <AddProductForm
          onSuccess={handleAddProductSuccess}
          onClose={() => setIsAddProductFormOpen(false)}
        />
      </CustomDrawer>

      <CustomDrawer
        opened={isViewProductsOpen}
        onClose={() => setIsViewProductsOpen(false)}
        title="List Products"
        size="xl"
      >
        <ProductsTable />
      </CustomDrawer>

      {/* Customer Drawers */}
      <CustomDrawer
        opened={isAddCustomerFormOpen}
        onClose={() => setIsAddCustomerFormOpen(false)}
        title="Add Customer"
        size="md"
      >
        <AddCustomerForm
          onSuccess={handleAddCustomerSuccess}
          onClose={() => setIsAddCustomerFormOpen(false)}
        />
      </CustomDrawer>

      <CustomDrawer
        opened={isViewCustomersOpen}
        onClose={() => setIsViewCustomersOpen(false)}
        title="List Customers"
        size="xl"
      >
        <CustomersTable />
      </CustomDrawer>

      {/* Sales Drawers */}
      <CustomDrawer
        opened={isAddSaleFormOpen}
        onClose={() => setIsAddSaleFormOpen(false)}
        title="Add Sale"
        size="md"
      >
        <AddSaleForm
          onSuccess={handleAddSaleSuccess}
          onClose={() => setIsAddSaleFormOpen(false)}
        />
      </CustomDrawer>

      <CustomDrawer
        opened={isViewSalesOpen}
        onClose={() => setIsViewSalesOpen(false)}
        title="List Sales"
        size="xl"
      >
        <SalesTable />
      </CustomDrawer>
    </>
  )
}

export default Sidebar;
