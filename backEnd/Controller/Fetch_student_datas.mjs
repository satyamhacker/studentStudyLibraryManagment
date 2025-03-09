import AddData from "../Models/Add_Student_Data.mjs"; // Adjust the path as necessary

// Controller to fetch student data
export const fetchStudentsData = async (req, res) => {
  try {
    // Fetch all student data from the database
    const students = await AddData.find();

    // If no students found, return an empty array
    if (!students || students.length === 0) {
      return res.status(200).json([]); // Return empty array if no students are found
    }

    // Send the fetched student data as response
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
