import { Button, TextInput, Textarea } from '@mantine/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { notifications } from '@mantine/notifications';

interface UpdateCustomerFormProps {
  onSuccess: () => void;
  onClose: () => void;
  initialValues: {
    id: string;
    name: string;
    description?: string;
  };
}

interface UpdateCustomerFormValues {
  id: string;
  name: string;
  description?: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
});

export function UpdateCustomerForm({ onSuccess, onClose, initialValues }: UpdateCustomerFormProps) {
  const handleSubmit = async (values: UpdateCustomerFormValues) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update customer');
      }

      notifications.show({
        title: 'Success',
        message: 'Customer updated successfully',
        color: 'green',
      });
      onSuccess();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update customer',
        color: 'red',
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <TextInput
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && errors.name}
            mb="md"
          />
          <Textarea
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.description && errors.description}
            mb="xl"
          />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Customer
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
} 