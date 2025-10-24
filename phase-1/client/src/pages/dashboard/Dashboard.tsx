import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const Dashboard: React.FC = () => {
  const { username, role } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <h3>Welcome, {username}!</h3>
      <h4>Role: {role}</h4>
    </>
  );
};

export default Dashboard;
