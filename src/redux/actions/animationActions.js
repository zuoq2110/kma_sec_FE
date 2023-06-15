import { ON_TOGGLE_SIDEBAR } from "../constants/animationConstants";

export const onToggleSidebar = (status) => {
  return {
    type: ON_TOGGLE_SIDEBAR,
    payload: status,
  };
};
