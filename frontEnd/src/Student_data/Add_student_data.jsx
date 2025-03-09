import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { TextField, InputAdornment, MenuItem } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import PaymentIcon from "@mui/icons-material/Payment";
import axios from "axios";

const AddStudent = () => {
  const [studentData, setStudentData] = useState({
    RegistrationNumber: "",
    AdmissionDate: "",
    StudentName: "",
    FatherName: "",
    Address: "",
    ContactNumber: "",
    TimeSlots: [],
    Shift: "",
    SeatNumber: "",
    FeesPaidTillDate: "",
    AmountPaid: "",
    AmountDue: "",
    LockerNumber: "",
  });

  const [errors, setErrors] = useState({});

  const timeOptions = [
    { label: "06:00 - 10:00", value: "06:00-10:00" },
    { label: "10:00 - 14:00", value: "10:00-14:00" },
    { label: "14:00 - 18:00", value: "14:00-18:00" },
    { label: "18:00 - 22:00", value: "18:00-22:00" },
    { label: "22:00 - 06:00", value: "22:00-06:00" },
    { label: "Reserved", value: "reserved" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ContactNumber") {
      const regex = /^\d{0,10}$/;
      if (regex.test(value) || value === "") {
        setErrors({
          ...errors,
          ContactNumber:
            value.length > 10 ? "Contact Number must be 10 digits" : "",
        });
        setStudentData({
          ...studentData,
          [name]: value,
        });
      } else {
        setErrors({
          ...errors,
          ContactNumber: "Contact Number must be numeric",
        });
      }
    } else {
      setStudentData({
        ...studentData,
        [name]: value,
      });
      // Clear error when user starts typing
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleTimeChange = (e) => {
    const selectedTimes = e.target.value;
    setStudentData({
      ...studentData,
      TimeSlots: selectedTimes,
    });
    setErrors({
      ...errors,
      TimeSlots: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(studentData).forEach((key) => {
      if (key === "TimeSlots") {
        if (studentData[key].length === 0) {
          newErrors[key] = "Please select at least one time slot";
        }
      } else if (
        key !== "SeatNumber" &&
        key !== "LockerNumber" &&
        key !== "AmountDue"
      ) {
        // Optional fields
        if (!studentData[key]) {
          newErrors[key] = `${key
            .replace(/([A-Z])/g, " $1")
            .trim()} is required`;
        }
      }
    });

    if (studentData.ContactNumber.length !== 10) {
      newErrors.ContactNumber = "Contact Number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formattedData = {
        ...studentData,
        AmountPaid: studentData.AmountPaid.replace("₹", "").trim(),
        AmountDue: studentData.AmountDue.replace("₹", "").trim(),
      };

      console.log("Data being sent to backend:", formattedData);

      const response = await axios.post(
        "http://localhost:3000/addStudent",
        formattedData
      );

      alert(response.data.message);
      console.log("Server response:", response);

      setStudentData({
        RegistrationNumber: "",
        AdmissionDate: "",
        StudentName: "",
        FatherName: "",
        Address: "",
        ContactNumber: "",
        TimeSlots: [],
        Shift: "",
        SeatNumber: "",
        FeesPaidTillDate: "",
        AmountPaid: "",
        AmountDue: "",
        LockerNumber: "",
      });
      setErrors({});
    } catch (error) {
      if (error.response?.status === 409) {
        const { conflictingStudent } = error.response.data;
        alert(
          `Seat ${studentData.SeatNumber} is occupied by ${
            conflictingStudent.StudentName
          } for time slots: ${conflictingStudent.TimeSlots.join(", ")}`
        );
      } else {
        const errorMessage =
          error.response?.data?.error || "Error adding student data";
        console.error("Error adding student:", errorMessage);
        alert(errorMessage);
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4 bg-green-500">Add Student Details</h2>
      <Form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Registration Number</Form.Label>
              <TextField
                variant="outlined"
                name="RegistrationNumber"
                value={studentData.RegistrationNumber}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Enter Registration Number"
                error={!!errors.RegistrationNumber}
                helperText={errors.RegistrationNumber}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Admission Date</Form.Label>
              <TextField
                variant="outlined"
                type="date"
                name="AdmissionDate"
                value={studentData.AdmissionDate}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.AdmissionDate}
                helperText={errors.AdmissionDate}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Student Name</Form.Label>
              <TextField
                variant="outlined"
                name="StudentName"
                value={studentData.StudentName}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Enter Student Name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
                error={!!errors.StudentName}
                helperText={errors.StudentName}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Father's Name</Form.Label>
              <TextField
                variant="outlined"
                name="FatherName"
                value={studentData.FatherName}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Enter Father's Name"
                error={!!errors.FatherName}
                helperText={errors.FatherName}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <TextField
                variant="outlined"
                name="Address"
                value={studentData.Address}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Enter Address"
                error={!!errors.Address}
                helperText={errors.Address}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <TextField
                variant="outlined"
                name="ContactNumber"
                value={studentData.ContactNumber}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Enter Contact Number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ContactPhoneIcon />
                    </InputAdornment>
                  ),
                }}
                error={!!errors.ContactNumber}
                helperText={errors.ContactNumber}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Time Slots</Form.Label>
              <TextField
                select
                variant="outlined"
                name="TimeSlots"
                value={studentData.TimeSlots}
                onChange={handleTimeChange}
                fullWidth
                required
                SelectProps={{
                  multiple: true,
                }}
                error={!!errors.TimeSlots}
                helperText={errors.TimeSlots}
              >
                {timeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Shift</Form.Label>
              <TextField
                variant="outlined"
                name="Shift"
                value={studentData.Shift}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Enter Shift"
                error={!!errors.Shift}
                helperText={errors.Shift}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Seat Number</Form.Label>
              <TextField
                variant="outlined"
                name="SeatNumber"
                value={studentData.SeatNumber}
                onChange={handleChange}
                fullWidth
                placeholder="Enter Seat Number"
                error={!!errors.SeatNumber}
                helperText={errors.SeatNumber}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Locker Number</Form.Label>
              <TextField
                variant="outlined"
                name="LockerNumber"
                value={studentData.LockerNumber}
                onChange={handleChange}
                fullWidth
                placeholder="Enter Locker Number"
                error={!!errors.LockerNumber}
                helperText={errors.LockerNumber}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fees Paid Till Date</Form.Label>
              <TextField
                variant="outlined"
                type="date"
                name="FeesPaidTillDate"
                value={studentData.FeesPaidTillDate}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.FeesPaidTillDate}
                helperText={errors.FeesPaidTillDate}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Amount Paid</Form.Label>
          <TextField
            variant="outlined"
            name="AmountPaid"
            value={studentData.AmountPaid}
            onChange={handleChange}
            fullWidth
            required
            placeholder="Enter Amount Paid"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PaymentIcon />
                  <span className="mr-2">₹</span>
                </InputAdornment>
              ),
            }}
            error={!!errors.AmountPaid}
            helperText={errors.AmountPaid}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Amount Due</Form.Label>
          <TextField
            variant="outlined"
            name="AmountDue"
            value={studentData.AmountDue}
            onChange={handleChange}
            fullWidth
            placeholder="Enter Amount Due"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PaymentIcon />
                  <span className="mr-2">₹</span>
                </InputAdornment>
              ),
            }}
            error={!!errors.AmountDue}
            helperText={errors.AmountDue}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-full bg-blue-500 text-white"
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default AddStudent;
