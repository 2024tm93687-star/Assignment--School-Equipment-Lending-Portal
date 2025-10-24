import { FaTachometerAlt } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa6";

export const COLLABORATORS = [
  {
    id: "2024tm93684",
    name: "Himanshu Sajwan",
  },
  {
    id: "2024tm93687",
    name: "Pradeep Kumar Eeda",
  },
  {
    id: "2024tm93601",
    name: "Himanshu Chugh",
  },
  {
    id: "2024tm93591",
    name: "M Mrunalini",
  },
];

export const MENU_ITEMS = [
  {
    label: "Dashboard",
    icon: <FaTachometerAlt className="me-2" />,
    path: "/dashboard",
  },
  {
    label: "Equipment Listing",
    icon: <FaClipboardList className="me-2" />,
    path: "/equipments",
  },
  {
    label: "Requests",
    icon: <FaClipboardList className="me-2" />,
    path: "/equipments",
  },
];
