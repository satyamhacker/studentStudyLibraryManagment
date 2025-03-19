import { Student } from '../Models/modelsImportExport.mjs'; // Adjust path to your Student model
import { Op, literal } from 'sequelize'; // Ensure Op and literal are imported

export const updateStudentData = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the student by primary key (id)
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Exclude RegistrationNumber from the update data
    const { RegistrationNumber, SeatNumber, TimeSlots, ...updateData } = req.body;

    // Check if SeatNumber and TimeSlots are provided
    if (SeatNumber && TimeSlots) {
      // Find conflicting students for the same SeatNumber and overlapping TimeSlots
      const conflictingStudent = await Student.findOne({
        where: {
          SeatNumber,
          [Op.and]: [
            literal(`JSON_OVERLAPS(TimeSlots, '${JSON.stringify(TimeSlots)}')`)
          ],
          id: { [Op.ne]: id } // Exclude the current student being updated
        },
      });

      if (conflictingStudent) {
        // Find free time slots for the seat
        const occupiedTimeSlots = conflictingStudent.TimeSlots;
        const allTimeSlots = [
          "06:00-10:00",
          "10:00-14:00",
          "14:00-18:00",
          "18:00-22:00",
          "22:00-06:00",
          "reserved"
        ];
        const freeTimeSlots = allTimeSlots.filter(slot => !occupiedTimeSlots.includes(slot));

        return res.status(409).json({
          error: 'This time slot is occupied by another user.',
          occupiedBy: conflictingStudent.StudentName,
          freeTimeSlots
        });
      }

      // Update SeatNumber and TimeSlots in updateData
      updateData.SeatNumber = SeatNumber;
      updateData.TimeSlots = TimeSlots;
    }

    // Update the student with the request body, excluding RegistrationNumber
    await student.update(updateData);

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