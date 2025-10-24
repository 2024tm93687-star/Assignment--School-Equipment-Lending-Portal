import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const Dashboard: React.FC = () => {
  const { username } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <h3>Welcome, {username}!</h3>
      <p>Select a menu item to view content.</p>
    </>
  );
};

export default Dashboard;
