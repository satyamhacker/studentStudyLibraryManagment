import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button, Card } from "react-bootstrap";
import axios from "axios";

const ShowVacantSeats = () => {
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch occupied seat data from backend
  useEffect(() => {
    fetchOccupiedSeats();
  }, []);

  const fetchOccupiedSeats = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getStudents"); // Updated endpoint
      setStudents(response.data); // Store all student data
      console.log("Students data:", response.data);

      // Ensure that SeatNumber is treated as a string
      const seatNumbers = response.data
        .map((student) => student.SeatNumber)
        .filter((seat) => seat !== null && seat !== undefined) // Filter out null or undefined SeatNumbers
        .map((seat) => seat.toString()); // Convert to strings

      setOccupiedSeats(seatNumbers);
      console.log("Occupied seats from server:", seatNumbers);
    } catch (error) {
      console.error("Error fetching occupied seats:", error);
    }
  };

  // Create an array of seat numbers from 1 to 82
  const totalSeats = 100;
  const seats = Array.from({ length: totalSeats }, (_, index) => index + 1);

  // Handle seat click to show modal
  const handleSeatClick = (seatNumber) => {
    console.log("Seat clicked:", students);
    // Convert seatNumber to string for comparison with SeatNumber
    const selectedStudents = students.filter(
      (s) => s.SeatNumber === seatNumber.toString()
    );
    if (selectedStudents.length > 0) {
      console.log("Selected students:", selectedStudents);
      setSelectedStudents(selectedStudents);
      setShowModal(true);
    } else {
      console.log(`No student found for seat number: ${seatNumber}`);
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudents([]);
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
      <h2 className="bg-yellow-300 my-4">Seat Allocation List</h2>
      <Row>
        {seats.map((seatNumber) => (
          <Col
            key={seatNumber}
            xs={3}
            className="d-flex justify-content-center align-items-center"
          >
            <div
              onClick={() => {
                if (occupiedSeats.includes(seatNumber.toString())) {
                  handleSeatClick(seatNumber);
                }
              }}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: occupiedSeats.includes(seatNumber.toString())
                  ? "green"
                  : "white",
                border: "1px solid black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5px",
                margin: "5px",
                cursor: occupiedSeats.includes(seatNumber.toString())
                  ? "pointer"
                  : "default",
                transition: "background-color 0.3s",
              }}
            >
              {seatNumber}
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
          {selectedStudents.map((student, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Card.Title>{student.StudentName}</Card.Title>
                <Card.Text>
                  <p>
                    <strong>Registration Number:</strong>{" "}
                    {student.RegistrationNumber}
                  </p>
                  <p>
                    <strong>Date Of Admission:</strong>{" "}
                    {formatDate(student.AdmissionDate)}
                  </p>
                  <p>
                    <strong>Father's Name:</strong> {student.FatherName}
                  </p>
                  <p>
                    <strong>Address:</strong> {student.Address}
                  </p>
                  <p>
                    <strong>Contact Number:</strong> {student.ContactNumber}
                  </p>
                  <p>
                    <strong>Time Slots:</strong> {student.TimeSlots.join(", ")}
                  </p>
                  <p>
                    <strong>Shift:</strong> {student.Shift}
                  </p>
                  <p>
                    <strong>Seat Number:</strong> {student.SeatNumber}
                  </p>
                  <p>
                    <strong>Amount Paid:</strong> ₹{student.AmountPaid}
                  </p>
                  <p>
                    <strong>Amount Due:</strong> ₹{student.AmountDue || "0"}
                  </p>
                  <p>
                    <strong>Locker Number:</strong> {student.LockerNumber}
                  </p>
                  <p>
                    <strong>Fees Paid Till Date:</strong>{" "}
                    {formatDate(student.FeesPaidTillDate)}
                  </p>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
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

export default ShowVacantSeats;
