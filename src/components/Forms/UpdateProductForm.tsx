import { Button, TextInput, Textarea } from '@mantine/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { notifications } from '@mantine/notifications';

interface UpdateProductFormProps {
  onSuccess: () => void;
  onClose: () => void;
  initialValues: {
    id: string;
    name: string;
    serialNumber: string;
    description?: string;
  };
}

interface UpdateProductFormValues {
  id: string;
  name: string;
  serialNumber: string;
  description?: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  serialNumber: Yup.string().required('Serial number is required'),
  description: Yup.string(),
});

export function UpdateProductForm({ onSuccess, onClose, initialValues }: UpdateProductFormProps) {
  const handleSubmit = async (values: UpdateProductFormValues) => {
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      notifications.show({
        title: 'Success',
        message: 'Product updated successfully',
        color: 'green',
      });
      onSuccess();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update product',
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
          <TextInput
            label="Serial Number"
            name="serialNumber"
            value={values.serialNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.serialNumber && errors.serialNumber}
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
              Update Product
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
} 