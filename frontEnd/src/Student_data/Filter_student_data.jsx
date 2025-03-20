import React, { useState } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/filterStudentData.css"; // Import custom styles

const FilterStudentData = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleFilterClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleApplyFilter = () => {
    let filterMessage = "Selected Filters: ";
    if (selectedYear) filterMessage += `Year: ${selectedYear} `;
    if (selectedMonth) filterMessage += `Month: ${selectedMonth} `;
    if (startDate && endDate)
      filterMessage += `Date Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    alert(filterMessage);
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
                />
              </div>
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
