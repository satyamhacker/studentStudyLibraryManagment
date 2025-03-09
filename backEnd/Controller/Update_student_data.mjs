import {Student} from '../Models/modelsImportExport.mjs'; // Adjust path to your Student model

export const updateStudentData = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the student by primary key (id)
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update the student with the request body
    await student.update(req.body);

    // Fetch the updated student (optional, Sequelize updates in place)
    const updatedStudent = await Student.findByPk(id);

    res.status(200).json(updatedStudent); // Send the updated student back
  } catch (error) {
    console.error('Error updating student:', error);
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};