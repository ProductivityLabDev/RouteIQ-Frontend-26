import React from "react";

export interface CreateRouteProps {
  onBack: () => void;
  editRoute?: boolean;
  isEditable?: boolean;
  handleBackTrip: () => void;
  initialRoute?: any;
  initialRouteDetails?: any;
  initialRouteStudents?: any[];
}

declare const CreateRoute: React.FC<CreateRouteProps>;
export default CreateRoute;

