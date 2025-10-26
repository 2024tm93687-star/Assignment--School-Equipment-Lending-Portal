import React from "react";
import { Form, Placeholder } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  placeholder?: string;
  search: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, search, onSearchChange }) => (
  <div className="d-flex justify-content-md-end mt-2 mt-md-0">
    <Form.Control
      type="text"
      placeholder={placeholder || "Search..."}
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      className="me-2"
    />
    <FaSearch size={20} className="align-self-center" />
  </div>
);

export default SearchBar;
