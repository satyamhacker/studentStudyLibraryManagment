import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import axios from "axios";

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
      const response = await axios.get("http://localhost:3000/getStudents"); // Corrected endpoint
      const studentsData = response.data;
      console.log("Students data:", studentsData);

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
    <Container>
      <h2 className="bg-yellow-200 my-9">
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
        style={{
          marginBottom: "20px",
          padding: "10px",
          width: "100%",
          border: "2px solid #007bff",
          borderRadius: "5px",
          outline: "none",
          boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)",
        }}
      />

      <Row>
        {filteredExpiredStudents.length > 0 ? (
          filteredExpiredStudents.map((student) => (
            <Col key={student.id} xs={12} className="my-2">
              <div
                onClick={() => handleStudentClick(student)}
                style={{
                  border: "1px solid black",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
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
            <p>No students have fees due as of today.</p>
          </Col>
        )}
      </Row>

      {/* Modal for displaying student details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <Button className="bg-black text-white" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ShowStudentsWithEndedMonth;
