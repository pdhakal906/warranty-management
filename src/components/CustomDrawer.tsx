"use client";
import { useDisclosure } from '@mantine/hooks';
import { Drawer } from "@mantine/core";
import { ReactNode } from 'react';

interface CustomDrawerProps {
  children: ReactNode;
  opened?: boolean;
  onClose?: () => void;
  title?: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: string | number;
}

export const CustomDrawer = ({
  children,
  opened: controlledOpened,
  onClose: controlledOnClose,
  title,
  position = 'right',
  size = 'md'
}: CustomDrawerProps) => {
  const [uncontrolledOpened, { close }] = useDisclosure(false);

  const isControlled = controlledOpened !== undefined;
  const opened = isControlled ? controlledOpened : uncontrolledOpened;
  const handleClose = isControlled ? (controlledOnClose || (() => { })) : close;

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      title={title}
      position={position}
      size={size}
    >
      {children}
    </Drawer>
  );
};

