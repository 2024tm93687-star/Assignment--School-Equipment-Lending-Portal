import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Container, Row, Col } from "react-bootstrap";
import Footer, { type FooterProps } from "../components/Footer/Footer";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { COLLABORATORS, MENU_ITEMS } from "../utils/constants";
import { FaSchool } from "react-icons/fa";
import { useDispatch } from "react-redux";
import type { AppDispatch } from ".././store";
import { fetchCurrentUserThunk } from "../features/auth/auth-thunks";

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchCurrentUserThunk());
    }
  }, [dispatch]);

  return isAuthenticated ? (
    <Container fluid className="min-vh-100 d-flex flex-column p-0">
      <Header
        brand={
          <span className="d-flex gap-2 align-items-center">
            <FaSchool />
            School Equipment Lending Portal
          </span>
        }
      />
      <Row className="g-0 flex-grow-1" style={{ minHeight: 0 }}>
        <Col xs={12} md={3} lg={2}>
          <Sidebar menuItems={MENU_ITEMS} />
        </Col>
        <Col xs={12} md={9} lg={10} className="p-4">
          <Outlet />
        </Col>
      </Row>
      <Footer
        heading={"Group 8 Team Members"}
        members={COLLABORATORS as FooterProps["members"]}
        copyright={
          <span>
            &copy; {new Date().getFullYear()} Group 8 Assignment 1 <br /> Full
            Stack Application Development
          </span>
        }
      />
    </Container>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
