import React from "react";
import { SchoolSummary } from "@/services/schoolService";

export interface SchoolManagementProps {}

export interface SchoolManagementModalProps {
  open: boolean;
  handleOpen: () => void;
  editInstitute: boolean;
  editSchoolData?: any;
  refreshSchools: () => void;
}

export interface SchoolManagementUserTableProps {
  instituteId: number | string;
}

declare const SchoolManagement: React.FC<SchoolManagementProps>;
export default SchoolManagement;

