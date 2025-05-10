'use client'
import { Box, Button, Flex, Stack } from '@mantine/core'
import React, { useState } from 'react'
import { CustomDrawer } from './CustomDrawer';
import ProductsTable from './Tables/ProductsTable';
import { AddProductForm } from './Forms/AddProductForm';

const Sidebar = () => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isViewProductsOpen, setIsViewProductsOpen] = useState(false);

  const handleAddSuccess = () => {
    setIsAddFormOpen(false);
  };

  return (
    <>
      <Box h={'100vh'} bg='gray.1' p={10}>
        <Stack gap={0}>
          <Button variant='subtle' p={10} fw={500} c={'red'}>Product</Button>
          <Flex p={0} justify={'right'}>
            <Button variant='subtle' p={10} fw={500} c={'blue'} onClick={() => setIsAddFormOpen(true)} >Add</Button>
          </Flex>
          <Flex p={0} justify={'right'}>
            <Button variant='subtle' p={10} fw={500} c={'blue'} onClick={() => setIsViewProductsOpen(true)}>List</Button>
          </Flex>
          <Button variant='subtle' p={10} fw={500} c={'blue'} >Purchase</Button>
          <Flex justify={'right'}>
            <Button variant='subtle' p={10} fw={500} c={'blue'} >Add</Button>
          </Flex>
          <Button variant='subtle' p={10} fw={500} c={'green'}>Sales</Button>
          <Flex justify={'right'}>
            <Button variant='subtle' p={10} fw={500} c={'blue'} >Add</Button>
          </Flex>
        </Stack>
      </Box>
      <CustomDrawer
        opened={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        title="Add Product"
        size="md"
      >
        <AddProductForm
          onSuccess={handleAddSuccess}
          onClose={() => setIsAddFormOpen(false)}
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
    </>
  )
}

export default Sidebar
