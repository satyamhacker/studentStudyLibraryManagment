import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import axios from "axios";
import "../styles/neonExpired.css"; // Custom CSS file for neon effects

const ShowStudentsWithEndedMonth = () => {
  const [students, setStudents] = useState([]);
  const [expiredStudents, setExpiredStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch student data from backend
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("jwtToken"); // Retrieve token from localStorage
      const response = await axios.get("http://localhost:3000/getStudents", {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      }); // API endpoint unchanged
      const studentsData = response.data;
      // console.log("Students data:", studentsData);

      // Filter students whose FeesPaidTillDate has passed the current date
      const currentDate = new Date();
      const filteredStudents = studentsData.filter((student) => {
        const feesPaidTillDate = new Date(student.FeesPaidTillDate);
        return feesPaidTillDate < currentDate; // Show students whose fee period has ended as of today
      });

      setStudents(studentsData);
      setExpiredStudents(filteredStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Handle student click to show modal with details
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter expired students based on search term
  const filteredExpiredStudents = expiredStudents.filter((student) =>
    student.StudentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US");
  };

  return (
    <Container className="mt-5">
      <h2 className="neon-header text-center mb-4">
        Students with Fees Due as of:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h2>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search by Student Name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="neon-input mb-4 w-100"
      />

      <div className="neon-card-container">
        <Row>
          {filteredExpiredStudents.length > 0 ? (
            filteredExpiredStudents.map((student) => (
              <Col key={student.id} xs={12} sm={6} md={4} className="my-3">
                <div
                  onClick={() => handleStudentClick(student)}
                  className="neon-card"
                >
                  <strong>Name:</strong> {student.StudentName} <br />
                  <strong>Registration Number:</strong>{" "}
                  {student.RegistrationNumber} <br />
                  <strong>Date of Admission:</strong>{" "}
                  {formatDate(student.AdmissionDate)}
                </div>
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <p className="text-center">
                No students have fees due as of today.
              </p>
            </Col>
          )}
        </Row>
      </div>

      {/* Modal for displaying student details */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="neon-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="neon-modal-title">
            Student Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="neon-modal-body">
          {selectedStudent && (
            <div>
              <p>
                <strong>Registration Number:</strong>{" "}
                {selectedStudent.RegistrationNumber}
              </p>
              <p>
                <strong>Date of Admission:</strong>{" "}
                {formatDate(selectedStudent.AdmissionDate)}
              </p>
              <p>
                <strong>Name:</strong> {selectedStudent.StudentName}
              </p>
              <p>
                <strong>Father's Name:</strong> {selectedStudent.FatherName}
              </p>
              <p>
                <strong>Address:</strong> {selectedStudent.Address}
              </p>
              <p>
                <strong>Contact Number:</strong> {selectedStudent.ContactNumber}
              </p>
              <p>
                <strong>Time Slots:</strong>{" "}
                {selectedStudent.TimeSlots.join(", ")}
              </p>
              <p>
                <strong>Shift:</strong> {selectedStudent.Shift}
              </p>
              <p>
                <strong>Seat Number:</strong> {selectedStudent.SeatNumber}
              </p>
              <p>
                <strong>Locker Number:</strong> {selectedStudent.LockerNumber}
              </p>
              <p>
                <strong>Amount Paid:</strong> ₹{selectedStudent.AmountPaid}
              </p>
              <p>
                <strong>Amount Due:</strong> ₹{selectedStudent.AmountDue || "0"}
              </p>
              <p>
                <strong>Fees Paid Till Date:</strong>{" "}
                {formatDate(selectedStudent.FeesPaidTillDate)}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="neon-button bg-black text-white"
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ShowStudentsWithEndedMonth;
