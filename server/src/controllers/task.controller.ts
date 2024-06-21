import { Request, Response } from 'express';
import express from 'express';
import { z } from 'zod';

import { appDataSource } from '../app-data-source';
import { Task } from '../entity/task.entity';
import { validateData } from '../middleware';

const TaskController = express.Router();

export const taskSchema = z.object({
  title: z.string().min(3, { message: 'Minimum 3 characters required' }),
  description: z.string().min(5, { message: 'Minimum 5 characters required' }),
  dueAt: z
    .optional(
      z.string().refine((date) => {
        return new Date(date) >= new Date(Date.now());
      }, 'The date must be a future date')
    )
    .nullish()
    .or(z.literal('')),
});

const createTask = async (req: Request, res: Response) => {
  const { title, description, dueAt } = req.body;
  try {
    const task = await appDataSource.getRepository(Task).create({
      title,
      description,
      dueAt: dueAt || null,
      userId: req.currentUser.id,
    });
    const result = await appDataSource.getRepository(Task).save(task);

    return res.send_ok('Success', { task: result });
  } catch (err) {
    console.log(err);
    return res.send_internalServerError('Internal server error');
  }
};

const updateTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;

  const { title, description, dueAt, status } = req.body;

  try {
    const task = await appDataSource.getRepository(Task).findOneBy({
      id: taskId,
      userId: req.currentUser.id,
    });

    if (!task) {
      return res.send_notFound('Task not found');
    }

    // Update the task with the new data
    const updatedTask = await appDataSource.getRepository(Task).save({
      id: taskId,
      title,
      description,
      dueAt,
      status,
    });

    // Respond with the updated task
    return res.send_ok('Updated task', updatedTask);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.send_internalServerError('Internal server error');
  }
};

const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;

  try {
    const task = await appDataSource.getRepository(Task).findOneBy({
      id: taskId,
      userId: req.currentUser.id,
    });

    if (!task) {
      return res.send_notFound('Task not found');
    }

    // Update the user with the new data
    const deleteTask = await appDataSource.getRepository(Task).delete({
      id: taskId,
    });

    // Respond with the updated user
    return res.send_ok('Updated task', deleteTask);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.send_internalServerError('Internal server error');
  }
};

const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await appDataSource.getRepository(Task).find({
      where: {
        userId: req.currentUser.id,
      },
    });

    return res.send_ok('Success', { tasks });
  } catch (err) {
    console.log(err);
    return res.send_internalServerError('Internal server error');
  }
};

TaskController.post('/', validateData(taskSchema), createTask);
TaskController.get('/', getAllTasks);
TaskController.patch('/:id', validateData(taskSchema.partial()), updateTask);
TaskController.delete('/:id', deleteTask);

export { TaskController };
