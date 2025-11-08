import React from "react";
import { Container } from "react-bootstrap";

interface Member {
  id: string | number;
  name: string;
}

export interface FooterProps {
  heading: string;
  members: Member[];
  copyright?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ heading, members, copyright }) => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container className="text-center">
        <h6 className="fw-bold mb-3 text-uppercase text-secondary">
          {heading}
        </h6>

        <div className="d-flex flex-wrap justify-content-center gap-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="px-3 py-1 bg-secondary rounded-pill small"
            >
              {member.name} <span className="text-light-50">({member.id})</span>
            </div>
          ))}
        </div>

        <div className="mt-3 text-secondary small">
          {copyright}
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
