import { ON_TOGGLE_SIDEBAR } from "../constants/animationConstants";

export const onToggleSidebarReducer = (state, action) => {
  switch (action.type) {
    case ON_TOGGLE_SIDEBAR:
      return {
        statusSidebar: action.payload,
      };
    default:
      return { ...state };
  }
};
