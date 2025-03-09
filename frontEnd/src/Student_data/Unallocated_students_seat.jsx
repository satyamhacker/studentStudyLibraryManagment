import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const UnallocatedStudentsSeat = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch student data from backend
  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getStudents"); // Corrected endpoint
      console.log("Response data:", response.data);
      const unallocatedStudents = response.data.filter(
        (student) => student.SeatNumber === "0" // Filter for SeatNumber "0"
      );

      if (unallocatedStudents.length === 0) {
        alert("All students have been allocated seats");
      }

      setStudents(unallocatedStudents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
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
      <Row>
        <Col>
          <h1 className="bg-green-600 text-white p-2">
            Students Without Seat Allocation
          </h1>
        </Col>
      </Row>

      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p>No students are currently unallocated (Seat Number: 0).</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Registration Number</th>
              <th>Admission Date</th>
              <th>Fees Paid Till</th>
              <th>Student Name</th>
              <th>Father's Name</th>
              <th>Address</th>
              <th>Contact Number</th>
              <th>Time Slots</th>
              <th>Shift</th>
              <th>Seat Number</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.RegistrationNumber}</td>
                <td>{formatDate(student.AdmissionDate)}</td>
                <td>{formatDate(student.FeesPaidTillDate)}</td>
                <td>{student.StudentName}</td>
                <td>{student.FatherName}</td>
                <td>{student.Address}</td>
                <td>{student.ContactNumber}</td>
                <td>{student.TimeSlots.join(", ")}</td>
                <td>{student.Shift}</td>
                <td>{student.SeatNumber}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UnallocatedStudentsSeat;
