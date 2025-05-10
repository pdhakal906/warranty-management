'use client';

import { Button, Stack, TextInput, Textarea } from '@mantine/core';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { notifications } from '@mantine/notifications';

interface FormValues {
  name: string;
  serialNumber: string;
  description: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  serialNumber: Yup.string().min(15).max(15).required('Serial number is required and must be 15 digit'),
  description: Yup.string(),
});

interface AddProductFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AddProductForm = ({ onSuccess, onClose }: AddProductFormProps) => {
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      const response = await fetch('/api/products', {
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
          message: 'Product added successfully',
          color: 'green',
        });
        resetForm();
        onSuccess?.();
        onClose?.();
      } else {
        notifications.show({
          title: 'Error',
          message: data.error || 'Failed to add product',
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
    <Formik
      initialValues={{
        name: '',
        serialNumber: '',
        description: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Stack gap="md">
            <Field
              name="serialNumber"
              as={TextInput}
              label="Serial Number"
              placeholder="Enter serial number"
              error={touched.serialNumber && errors.serialNumber}
            />

            <Field
              name="name"
              as={TextInput}
              label="Product Name"
              placeholder="Enter product name"
              error={touched.name && errors.name}
            />

            <Field
              name="description"
              as={Textarea}
              label="Description"
              placeholder="Enter product description (optional)"
              error={touched.description && errors.description}
            />

            <Button
              type="submit"
              loading={isSubmitting}
              fullWidth
            >
              Add Product
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
