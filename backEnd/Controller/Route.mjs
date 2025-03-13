import express from "express"; // Import Express
import cors from "cors"; // Import CORS middleware
import {
  signupCreate,
  login,
  addStudentData,
  fetchStudentsData,
  deleteStudentData,
  updateStudentData,
  exportStudentDataToExcel, // Import the new controller
} from "./index.Controller.mjs"; // Import your signupLogin controller

import { VerifyUserJwt } from '../Middleware/Jwt.mjs'; // Import the VerifyUserJwt middleware

const app = express(); // Create an Express app
const port = 3000; // Port number on which your server will run

app.use(cors()); // Enable CORS for all routes

// Middleware to parse JSON requests (no need for bodyParser, it's part of Express)
app.use(express.json());

app.post("/signup", signupCreate); // Route for signup
app.post("/login", login); // Route for login
app.post("/addStudent",VerifyUserJwt,addStudentData);

// Route for fetching student data
app.get("/getStudents",VerifyUserJwt, fetchStudentsData);

app.delete("/deleteStudent/:id",VerifyUserJwt, deleteStudentData);

app.put("/updateStudent/:id",VerifyUserJwt, updateStudentData);

app.get("/exportStudents",VerifyUserJwt, exportStudentDataToExcel); // Add the new route

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
