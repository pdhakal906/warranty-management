'use client';

import { Button, Stack, TextInput } from '@mantine/core';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

interface FormValues {
  number: string;
}

const validationSchema = Yup.object().shape({
  number: Yup.string().required('Serial number is required').min(16, "Serial number must be 16 characters long ").max(16, "Serial number must be 16 characters long "),
});

interface AddSerialNumberTempFormProps {
  productTempId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AddSerialNumberTempForm = ({ onSuccess, onClose, productTempId }: AddSerialNumberTempFormProps) => {
  const [submitAction, setSubmitAction] = useState(initialState)<'next' | 'save'>('next');

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
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
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        number: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
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
              loading={isSubmitting}
              onClick={() => setSubmitAction('next')}
              fullWidth
            >
              Next
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              onClick={() => setSubmitAction('save')}
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