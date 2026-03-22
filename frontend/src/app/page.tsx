"use client";

import { useState, useEffect } from "react";
import { Check, Trash2, Loader2, Sparkles } from "lucide-react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<{ name: string; "roll number": string } | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    fetchTasks();
    fetchStudentDetail();
  }, []);

  const fetchStudentDetail = async () => {
    try {
      const response = await fetch(`${API_URL}/students-detail`);
      const data = await response.json();
        setStudent(data);
    } catch (error) {
      console.error("Failed to fetch student detail:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error("Fetched tasks data is not an array:", data);
        setTasks([]);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });
      const task = await response.json();
      setTasks([task, ...tasks]);
      setNewTask("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      setTasks(
        tasks.map((t) => (t.id === id ? { ...t, completed: !completed } : t)),
      );
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#F0F2F5] text-black font-mono p-4 sm:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Header - Neo Brutalist Box */}
        <div className="bg-[#ccff00] border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-2">
              TASK_LIST
            </h1>
            <p className="font-bold text-lg bg-black text-white inline-block px-2 py-1">
              By {student ? `${student.name} ${student["roll number"]}` : "Loading..."}
            </p>
          </div>
          <Sparkles className="w-12 h-12" />
        </div>

        {/* Input Form - Bold & Hard Shadow */}
        <form onSubmit={addTask} className="mb-16">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="ENTER_NEW_TASK..."
              className="flex-1 bg-white border-[3px] border-black px-6 py-4 text-xl font-bold placeholder:text-gray-400 focus:outline-none focus:bg-[#ffde00] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
            <button
              type="submit"
              className="bg-[#00ffca] border-[3px] border-black px-8 py-4 font-black text-2xl uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
            >
              ADD_TASK
            </button>
          </div>
        </form>

        {/* Task List Container */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center p-20">
              <Loader2 className="w-16 h-16 animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="border-[3px] border-black p-12 text-center bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-dashed">
              <p className="text-2xl font-black uppercase italic">
                EMPTY_DATABASE
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-6 border-[3px] border-black group transition-all duration-100 ${
                  task.completed ? "bg-[#ff7597] opacity-80" : "bg-white"
                } shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]`}
              >
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`w-10 h-10 border-[3px] border-black flex items-center justify-center transition-colors ${
                      task.completed ? "bg-black" : "bg-[#ccff00]"
                    }`}
                  >
                    {task.completed && (
                      <Check className="text-white w-6 h-6 stroke-[4px]" />
                    )}
                  </button>
                  <span
                    className={`text-xl sm:text-2xl font-bold uppercase transition-all duration-100 ${
                      task.completed
                        ? "line-through text-black/40"
                        : "text-black"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-black text-white p-3 border-[2px] border-black hover:bg-[#ff00ea] hover:text-black transition-all"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Statistics */}
        {!loading && tasks.length > 0 && (
          <div className="mt-16 bg-black text-white p-6 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,255,0.2)]">
            <div className="flex justify-between font-black text-xl uppercase">
              <span>TOTAL_ITEMS: {tasks.length}</span>
              <span>COMPLETED: {tasks.filter((t) => t.completed).length}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
