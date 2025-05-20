'use client';

import { Button, Stack, Select, MultiSelect } from '@mantine/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { notifications } from '@mantine/notifications';
import useSWR from 'swr';
import { Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Customer {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  serialNumber: string;
}

interface Sale {
  id: string;
  customerId: string;
  dateOfPurchase: Date;
  products: Product[];
}

interface FormValues {
  customerId: string;
  dateOfPurchase: Date;
  productIds: string[];
}

interface UpdateSaleFormProps {
  sale: Sale;
  onSuccess?: () => void;
  onClose?: () => void;
}

const validationSchema = Yup.object().shape({
  customerId: Yup.string().required('Customer is required'),
  dateOfPurchase: Yup.date().required('Date of purchase is required'),
  productIds: Yup.array().min(1, 'At least one product is required').required('Products are required'),
});

export const UpdateSaleForm = ({ sale, onSuccess, onClose }: UpdateSaleFormProps) => {
  const { data: customersData } = useSWR<{ data: { customers: Customer[] } }>('/api/customers', fetcher);
  const { data: productsData } = useSWR<{ data: { products: Product[] } }>('/api/products', fetcher);

  const customers = customersData?.data?.customers || [];
  const products = productsData?.data?.products || [];

  const handleSubmit = async (values: FormValues) => {
    try {
      const response = await fetch(`/api/sales/${sale.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Sale updated successfully',
          color: 'green',
        });
        onSuccess?.();
        onClose?.();
      } else {
        notifications.show({
          title: 'Error',
          message: data.error || 'Failed to update sale',
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

  return (
    <Formik<FormValues>
      initialValues={{
        customerId: sale.customerId,
        dateOfPurchase: new Date(sale.dateOfPurchase),
        productIds: sale.products.map(product => product.id),
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, setFieldValue, values }) => (
        <Form>
          <Stack gap="md">
            <Select
              label="Customer"
              placeholder="Select a customer"
              data={customers.map((customer: Customer) => ({
                value: customer.id,
                label: customer.name,
              }))}
              value={values.customerId}
              onChange={(value: string | null) => setFieldValue('customerId', value || '')}
              error={touched.customerId && errors.customerId}
            />

            <DateInput
              label="Date of Purchase"
              placeholder="Select date"
              value={values.dateOfPurchase}
              onChange={(value: string | null) => setFieldValue('dateOfPurchase', value ? new Date(value) : new Date())}
              error={touched.dateOfPurchase && errors.dateOfPurchase ? 'Invalid date' : undefined}
            />

            <MultiSelect
              label="Products"
              placeholder="Select products"
              data={products.map((product: Product) => ({
                value: product.id,
                label: `${product.name} (${product.serialNumber})`,
              }))}
              value={values.productIds}
              onChange={(value: string[]) => setFieldValue('productIds', value)}
              error={touched.productIds && errors.productIds}
            />

            <Group justify="flex-end" gap="sm">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Update Sale
              </Button>
            </Group>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}; 