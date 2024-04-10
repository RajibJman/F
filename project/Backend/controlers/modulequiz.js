const Module = require('../models/module'); // Assuming you have a module model defined

const updateModuleQuizId = async (req, res) => {
    try {
      const { moduleId, quizId } = req.body;
  
      // Find the module by ID
      const module = await Module.findOne({ _id: moduleId });
  
      if (!module) {
        return res.status(404).json({ error: 'Module not found' });
      }
  
      // Update the quizId field with the provided quiz ID
      module.quizId = quizId;
  
      // Save the updated module
      await module.save();
  
      return res.status(200).json(module); // Return the updated module
    } catch (error) {
      return res.status(500).json({ error: 'Error updating module quizId: ' + error.message });
    }
  };
  
  module.exports = updateModuleQuizId;
