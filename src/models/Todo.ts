import { Schema, model, models } from 'mongoose';

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  category?: string;
  dueDate?: Date;
  aiCategory?: string;
  aiDueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<Todo>({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  category: String,
  dueDate: Date,
  aiCategory: String,
  aiDueDate: Date,
}, { timestamps: true });

const Todo = models.Todo || model<Todo>('Todo', todoSchema);
export default Todo;