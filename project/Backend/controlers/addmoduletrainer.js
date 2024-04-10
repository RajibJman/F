const Module = require('../models/module'); // Import the Module model

const addModuleTrainer = async (req, res) => {
  const { selectedUser_id, selectedModule_id } = req.body; // Get selectedUser_id and selectedModule_id from the request body

  try {
    // Find the module by selectedModule_id
    const module = await Module.findById(selectedModule_id);
    console.log(module);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Check if the selectedUser_id (trainer) is already assigned to the module
    const existingTrainer = module.trainer.find(trainer => trainer._id.toString() === selectedUser_id);
    if (existingTrainer) {
      return res.status(400).json({ error: 'Trainer already assigned to module' });
    }

    // Add the selectedUser_id (trainer) to the trainers array of the module
    module.trainer.push({ _id: selectedUser_id });

    // Save the updated module
    await module.save();

    return res.status(200).json({ message: 'Trainer added to Module successfully', module });
  } catch (error) {
    console.error('Error adding Trainer to Module:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addModuleTrainer };
