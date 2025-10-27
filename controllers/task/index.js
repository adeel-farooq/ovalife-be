const Task = require("../../models/task");
const Helpers = require("./helper");
const createTask = async (req, res) => {
  try {
    console.log("hello");

    const task = await Task.create(req.body);
    if (!task?.id) {
      return res.status(500).json({ message: "Task creation failed." });
    }
    return res
      .status(201)
      .json({ message: "Task created successfully.", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Task.update(req.body, { where: { id } });
    if (!updated) {
      return res.status(404).json({ message: "Task not found." });
    }
    if (updated) {
      const updatedTask = await Task.findOne({ where: { id } });
      return res
        .status(200)
        .json({ message: "Task updated successfully.", task: updatedTask });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Task not found." });
    }
    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    return res
      .status(200)
      .json({ message: "Task retrieved successfully.", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const getTasks = async (req, res) => {
  try {
    const whereClause = Helpers.prepareWhereClause(req.query);
    console.log(">>>>>>>>>>>>>>>>>>");

    let tasks;
    if (Object.keys(whereClause).length === 0) {
      tasks = await Task.findAll();
    } else {
      tasks = await Task.findAll({ where: whereClause });
    }
    return res
      .status(200)
      .json({ message: "Tasks retrieved successfully.", tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  getTasks,
};
