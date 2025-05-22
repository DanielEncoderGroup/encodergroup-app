declare module '@headlessui/react' {
  import { FC, ReactNode } from 'react';

  // Menu
  export interface MenuProps {
    as?: React.ElementType;
    children: ReactNode;
  }

  export interface MenuItemProps {
    as?: React.ElementType;
    disabled?: boolean;
    children: (props: { active: boolean; disabled: boolean }) => ReactNode;
  }

  export interface MenuButtonProps {
    as?: React.ElementType;
    className?: string;
    children: ReactNode;
  }

  export interface MenuItemsProps {
    as?: React.ElementType;
    className?: string;
    children: ReactNode;
  }

  export const Menu: FC<MenuProps> & {
    Button: FC<MenuButtonProps>;
    Items: FC<MenuItemsProps>;
    Item: FC<MenuItemProps>;
  };

  // Dialog
  export interface DialogProps {
    as?: React.ElementType;
    open: boolean;
    onClose: (open: boolean) => void;
    children: ReactNode;
    className?: string;
  }

  export interface DialogOverlayProps {
    as?: React.ElementType;
    className?: string;
    children?: ReactNode;
  }

  export const Dialog: FC<DialogProps> & {
    Overlay: FC<DialogOverlayProps>;
  };

  // Transition
  export interface TransitionProps {
    as?: React.ElementType;
    show?: boolean;
    appear?: boolean;
    unmount?: boolean;
    enter?: string;
    enterFrom?: string;
    enterTo?: string;
    leave?: string;
    leaveFrom?: string;
    leaveTo?: string;
    children: ReactNode;
  }

  export interface TransitionChildProps extends TransitionProps {}

  export const Transition: FC<TransitionProps> & {
    Root: FC<TransitionProps>;
    Child: FC<TransitionChildProps>;
  };
}
