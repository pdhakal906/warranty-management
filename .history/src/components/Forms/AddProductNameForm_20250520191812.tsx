'use client';

import { useRouter } from 'next/navigation';
import { Button, Stack, TextInput } from '@mantine/core';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { notifications } from '@mantine/notifications';

interface FormValues {
  name: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required')
});

interface AddProductFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AddProductNameForm = ({ onSuccess, onClose }: AddProductFormProps) => {
  const router = useRouter();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      const response = await fetch('/api/productTemp', {
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
        console.log(data.id)
        router.push(`/addProduct/${data.id}`);


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
              label="Product Name"
              placeholder="Enter product name"
              error={touched.name && errors.name}
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
