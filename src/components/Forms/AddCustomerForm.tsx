'use client';

import { Button, Stack, TextInput, Textarea } from '@mantine/core';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { notifications } from '@mantine/notifications';

interface FormValues {
  name: string;
  description: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Customer name is required'),
  description: Yup.string(),
});

interface AddCustomerFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AddCustomerForm = ({ onSuccess, onClose }: AddCustomerFormProps) => {
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      const response = await fetch('/api/customers', {
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
          message: 'Customer added successfully',
          color: 'green',
        });
        resetForm();
        onSuccess?.();
        onClose?.();
      } else {
        notifications.show({
          title: 'Error',
          message: data.error || 'Failed to add customer',
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
        description: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Stack gap="md">
            <Field
              name="name"
              as={TextInput}
              label="Customer Name"
              placeholder="Enter customer name"
              error={touched.name && errors.name}
            />

            <Field
              name="description"
              as={Textarea}
              label="Description"
              placeholder="Enter customer description (optional)"
              error={touched.description && errors.description}
            />

            <Button
              type="submit"
              loading={isSubmitting}
              fullWidth
            >
              Add Customer
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}; 