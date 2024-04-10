const Marks = require('../models/marks');

// Controller function to add marks
const addMarks = async (req, res) => {
  try {
    const { moduleId, userId, marks } = req.body;

    // Create a new marks entry
    const newMarks = new Marks({
      moduleId,
      userId,
      marks
    });

    // Save the marks entry
    await newMarks.save();

    res.status(201).json({ message: 'Marks added successfully', marks: newMarks });
  } catch (error) {
    console.error('Error adding marks:', error);
    res.status(500).json({ message: 'Failed to add marks' });
  }
};

// Controller function to get all marks
const getAllMarks = async (req, res) => {
  try {
    const allMarks = await Marks.find();
    res.status(200).json(allMarks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Failed to fetch marks' });
  }
};

// Controller function to get marks by user ID
const getMarksByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userMarks = await Marks.find({ userId });
    res.status(200).json(userMarks);
  } catch (error) {
    console.error('Error fetching marks by user ID:', error);
    res.status(500).json({ message: 'Failed to fetch marks by user ID' });
  }
};

// Controller function to get marks by module ID
const getMarksByModuleId = async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    const moduleMarks = await Marks.find({ moduleId });
    res.status(200).json(moduleMarks);
  } catch (error) {
    console.error('Error fetching marks by module ID:', error);
    res.status(500).json({ message: 'Failed to fetch marks by module ID' });
  }
};

module.exports = {
  addMarks,
  getAllMarks,
  getMarksByUserId,
  getMarksByModuleId
};
