import React, { useState } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/filterStudentData.css"; // Import custom styles
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { postRequest } from "../utils/api"; // Import the utility functions

const FilterStudentData = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentMode, setPaymentMode] = useState(""); // Add state for Payment Mode

  const navigate = useNavigate(); // Define navigate

  const handleFilterClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleApplyFilter = async () => {
    let filterMessage = {
      year: selectedYear,
      month: selectedMonth,
      dateRange:
        startDate && endDate
          ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
          : null,
      paymentMode, // Add Payment Mode to the filter message
    };

    try {
      await postRequest(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/filterStudentData`,
        filterMessage,
        navigate
      );
      alert("Filter applied successfully");
    } catch (error) {
      console.error("Error applying filter:", error);
      alert("Error applying filter");
    }

    handleCloseModal();
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - i
  );

  const getInitialDate = () => {
    if (selectedYear && selectedMonth) {
      return new Date(selectedYear, months.indexOf(selectedMonth));
    } else if (selectedYear) {
      return new Date(selectedYear, 0);
    } else {
      return new Date();
    }
  };

  return (
    <Container className="mt-5 filter-container">
      <Row className="justify-content-center">
        <Col xs={12} sm={4} className="mb-2">
          <Button
            variant="primary"
            className="w-100 filter-button neon-button"
            onClick={handleFilterClick}
          >
            Filter Student Data
          </Button>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="filter-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="neon-text">Filter Student Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="selectYear">
              <Form.Label className="neon-text">Select Year</Form.Label>
              <Form.Control
                as="select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="neon-input neon-dropdown"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year} className="neon-option">
                    {year}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="selectMonth" className="mt-3">
              <Form.Label className="neon-text">Select Month</Form.Label>
              <Form.Control
                as="select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="neon-input neon-dropdown"
              >
                <option value="">Select Month</option>
                {months.map((month, index) => (
                  <option key={index} value={month} className="neon-option">
                    {month}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="selectDateRange" className="mt-3">
              <Form.Label className="neon-text">Select Date Range</Form.Label>
              <div className="d-flex">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  className="form-control neon-input"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  openToDate={getInitialDate()}
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                  className="form-control neon-input ml-2"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  openToDate={getInitialDate()}
                />
              </div>
            </Form.Group>

            <Form.Group controlId="selectPaymentMode" className="mt-3">
              <Form.Label className="neon-text">Select Payment Mode</Form.Label>
              <Form.Control
                as="select"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="neon-input neon-dropdown"
              >
                <option value="">Select Payment Mode</option>
                <option value="online" className="neon-option">
                  Online
                </option>
                <option value="cash" className="neon-option">
                  Cash
                </option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            className="neon-button"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleApplyFilter}
            className="neon-button"
          >
            Apply Filter
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FilterStudentData;
