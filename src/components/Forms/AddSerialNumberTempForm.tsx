'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Stack, TextInput } from '@mantine/core';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { notifications } from '@mantine/notifications';
import { useRef, useState } from 'react';

interface FormValues {
  number: string;
}

const validationSchema = Yup.object().shape({
  number: Yup.string().required('Serial number is required').min(16, "Serial number must be 16 characters long ").max(16, "Serial number must be 16 characters long "),
});

const saveValidationSchema = Yup.object().shape({
  number: Yup.string().optional(), // Optional — no validation
});

interface AddSerialNumberTempFormProps {
  productTempId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AddSerialNumberTempForm = ({ onSuccess, onClose, productTempId }: AddSerialNumberTempFormProps) => {
  const actionRef = useRef<'next' | 'save'>('next');
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
  const router = useRouter();

  const searchParams = useSearchParams();
  const productName = searchParams.get('productName');


  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    if (actionRef.current === 'next') {
      setIsNextLoading(true);
      try {
        const response = await fetch('/api/serialNumberTemp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            productTempId
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSerialNumbers((prev) => [...prev, values.number]);

          notifications.show({
            title: 'Success',
            message: 'Serial number added successfully',
            color: 'green',
          });
          resetForm();
          onSuccess?.();
          onClose?.();
        } else {
          notifications.show({
            title: 'Error',
            message: data.error || 'Failed to add serial number',
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
        setIsNextLoading(false);
      }
    }
    if (actionRef.current === 'save') {
      setIsSaveLoading(true);

      try {
        // Example payload, adjust as needed
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: productName,
            serialNumbers: serialNumbers,
            description: 'product added', // Add description if available
          }),
        });

        const data = await response.json();

        if (response.ok) {
          notifications.show({
            title: 'Success',
            message: 'Product saved successfully',
            color: 'green',
          });
          resetForm();
          onSuccess?.();
          onClose?.();
          router.push(`/`);
        } else {
          notifications.show({
            title: 'Error',
            message: data.error || 'Failed to save product',
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
        setIsSaveLoading(false);
      }
    }
  };

  return (
    <Formik
      initialValues={{
        number: '',
      }}
      validationSchema={() => actionRef.current === 'next' ? validationSchema : saveValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Stack gap="md">
            <Field
              name="number"
              as={TextInput}
              label="Serial Number"
              placeholder="Enter serial number"
              error={touched.number && errors.number}
            />

            <Button
              type="submit"
              loading={isNextLoading}
              onClick={() => actionRef.current = 'next'}
              fullWidth
            >
              Next
            </Button>
            <Button
              type="submit"
              loading={isSaveLoading}
              // disabled={serialNumbers.length === 0}
              onClick={() => actionRef.current = 'save'}
              fullWidth
            >
              Save
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}; 