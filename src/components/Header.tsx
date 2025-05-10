'use client'
import { Box, Button, Group, Input, Text } from '@mantine/core'
import React from 'react'

const Header = () => {
  return (
    <Box p={10} bg='gray.1'>
      <Group justify='space-between'>
        <Text fw={700} fz={20} c={'blue'}>Warranty Management</Text>
        <Group gap={5}>
          <Input placeholder='Enter Serial Number' />
          <Button>Search</Button>
        </Group>
      </Group>
    </Box>
  )
}

export default Header
