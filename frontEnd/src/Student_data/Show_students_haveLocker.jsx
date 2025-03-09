import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import axios from "axios";

const ShowLockers = () => {
  const [occupiedLockers, setOccupiedLockers] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch occupied locker data from backend
  useEffect(() => {
    fetchOccupiedLockers();
  }, []);

  const fetchOccupiedLockers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getStudents"); // Updated endpoint
      setStudents(response.data); // Store all student data

      // Extract locker numbers from students data
      const lockerNumbers = response.data
        .map((student) => student.LockerNumber)
        .filter((locker) => locker !== null && locker !== undefined) // Filter out null or undefined LockerNumbers
        .map((locker) => locker.toString()); // Ensure all are strings

      setOccupiedLockers(lockerNumbers);
      console.log("Occupied lockers from server:", lockerNumbers);
    } catch (error) {
      console.error("Error fetching occupied lockers:", error);
    }
  };

  // Create an array of locker numbers from 1 to 100
  const totalLockers = 100;
  const lockers = Array.from({ length: totalLockers }, (_, index) => index + 1);

  // Handle locker click to show modal
  const handleLockerClick = (lockerNumber) => {
    // Convert lockerNumber to string for comparison
    const student = students.find(
      (s) => s.LockerNumber === lockerNumber.toString()
    );
    if (student) {
      setSelectedStudent(student);
      setShowModal(true);
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US");
  };

  return (
    <Container>
      <h2 className="bg-yellow-300 my-4">Locker Allocation</h2>
      <Row>
        {lockers.map((lockerNumber) => (
          <Col
            key={lockerNumber}
            xs={3}
            className="d-flex justify-content-center align-items-center"
          >
            <div
              onClick={() =>
                occupiedLockers.includes(lockerNumber.toString()) &&
                handleLockerClick(lockerNumber)
              }
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: occupiedLockers.includes(
                  lockerNumber.toString()
                )
                  ? "green"
                  : "white",
                border: "1px solid black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5px",
                margin: "5px",
                cursor: occupiedLockers.includes(lockerNumber.toString())
                  ? "pointer"
                  : "default",
                transition: "background-color 0.3s",
              }}
            >
              {lockerNumber}
            </div>
          </Col>
        ))}
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
                <strong>Name:</strong> {selectedStudent.StudentName}
              </p>
              <p>
                <strong>Date Of Admission:</strong>{" "}
                {formatDate(selectedStudent.AdmissionDate)}
              </p>
              <p>
                <strong>Registration Number:</strong>{" "}
                {selectedStudent.RegistrationNumber}
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
                <strong>Fees Paid Till:</strong>{" "}
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

export default ShowLockers;
