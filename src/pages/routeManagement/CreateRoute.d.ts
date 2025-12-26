import React from "react";

export interface CreateRouteProps {
  onBack: () => void;
  editRoute?: boolean;
  isEditable?: boolean;
  handleBackTrip: () => void;
}

declare const CreateRoute: React.FC<CreateRouteProps>;
export default CreateRoute;

