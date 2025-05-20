'use client';

import { Button, Stack, Select, MultiSelect } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { notifications } from '@mantine/notifications';
import useSWR from 'swr';

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

interface FormValues {
  customerId: string;
  dateOfPurchase: Date;
  productIds: string[];
}

const validationSchema = Yup.object().shape({
  customerId: Yup.string().required('Customer is required'),
  dateOfPurchase: Yup.date().required('Date of purchase is required'),
  productIds: Yup.array().min(1, 'At least one product is required').required('Products are required'),
});

interface AddSaleFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AddSaleForm = ({ onSuccess, onClose }: AddSaleFormProps) => {
  const { data: customersData } = useSWR<{ data: { customers: Customer[] } }>('/api/customers', fetcher);
  const { data: productsData } = useSWR<{ data: { products: Product[] } }>('/api/products', fetcher);

  const customers = customersData?.data?.customers || [];
  const products = productsData?.data?.products || [];

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Sale added successfully',
          color: 'green',
        });
        resetForm();
        onSuccess?.();
        onClose?.();
      } else {
        notifications.show({
          title: 'Error',
          message: data.error || 'Failed to add sale',
          color: 'red',
        });
      }
    } catch {
      notifications.show({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik<FormValues>
      initialValues={{
        customerId: '',
        dateOfPurchase: new Date(),
        productIds: [],
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
              onChange={(value: string) => setFieldValue('customerId', value)}
              error={touched.customerId && errors.customerId}
            />

            <DateInput
              label="Date of Purchase"
              placeholder="Select date"
              value={values.dateOfPurchase}
              onChange={(value: Date) => setFieldValue('dateOfPurchase', value)}
              error={touched.dateOfPurchase && errors.dateOfPurchase}
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

            <Button
              type="submit"
              loading={isSubmitting}
              fullWidth
            >
              Add Sale
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}; 