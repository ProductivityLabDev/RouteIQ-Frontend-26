import React from "react";
import { User } from "@/services/userService";

export interface AccessManagementProps {}

export interface UserCardProps {
  handleOpenDeleteModal: (userId: number | string) => void;
  handleEditUser: (user: User) => void;
  refreshTrigger: number;
}

export interface CreateAccessCardProps {
  setCreateAccess: (isOpen: boolean) => void;
  editUser: User | null;
}

export interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export interface DeletePersonal {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

declare const AccessManagement: React.FC<AccessManagementProps>;
export default AccessManagement;

