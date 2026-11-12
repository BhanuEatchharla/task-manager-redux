
"use client";

import { useEffect, useState } from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../lib/hooks";

import {
  fetchTasks,
  addTask,
  toggleTask,
  deleteTask,
  setFilter,
  selectVisibleTasks,
  selectTaskStats,
} from "../features/tasks/tasksSlice";

type FilterType = "all" | "active" | "completed";

export default function TaskDashboard() {
  // Typed Redux hooks
  const dispatch = useAppDispatch();

  const tasks = useAppSelector(selectVisibleTasks);

  const stats = useAppSelector(selectTaskStats);

  const { status, error, filter } = useAppSelector(
    (state) => state.tasks
  );

  const [title, setTitle] = useState("");

  // Fetch API tasks
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  // Add task
  const handleAddTask = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!title.trim()) return;

    dispatch(addTask(title.trim()));

    setTitle("");
  };

  // Change filter
  const handleFilter = (value: FilterType) => {
    dispatch(setFilter(value));
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">

        <header className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            REDUX TOOLKIT PROJECT
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            TaskFlow Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your tasks with Redux Toolkit.
          </p>
        </header>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <StatCard label="Total Tasks" value={stats.total} />

          <StatCard label="Active Tasks" value={stats.active} />

          <StatCard label="Completed" value={stats.completed} />

        </section>

        {/* Add Task */}
        <form
          onSubmit={handleAddTask}
          className="mb-6 flex gap-3"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a new task..."
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Add Task
          </button>

        </form>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap gap-2">

          {(["all", "active", "completed"] as const).map(
            (item) => (
              <button
                key={item}
                onClick={() => handleFilter(item)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                  filter === item
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            onClick={() => dispatch(fetchTasks())}
            disabled={status === "loading"}
            className="ml-auto rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          >
            {status === "loading" ? "Loading..." : "Refresh API"}
          </button>

        </div>

        {/* Loading */}
        {status === "loading" && (
          <p className="rounded-lg bg-white p-5 text-center">
            Loading tasks...
          </p>
        )}

        {/* Error */}
        {status === "failed" && (
          <div className="rounded-lg bg-red-50 p-5 text-red-700">
            {error}

            <button
              onClick={() => dispatch(fetchTasks())}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Task List */}
        {status !== "loading" && (
          <section className="space-y-3">

            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-3">

                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      dispatch(toggleTask(task.id))
                    }
                    className="h-5 w-5 accent-blue-600"
                  />

                  <span
                    className={`break-words ${
                      task.completed
                        ? "text-slate-400 line-through"
                        : "text-slate-800"
                    }`}
                  >
                    {task.title}
                  </span>

                </div>

                <button
                  onClick={() =>
                    dispatch(deleteTask(task.id))
                  }
                  className="shrink-0 text-sm font-medium text-red-500 hover:text-red-700"
                >
                  Delete
                </button>

              </div>
            ))}

            {tasks.length === 0 && status === "succeeded" && (
              <p className="rounded-lg bg-white p-8 text-center text-slate-500">
                No tasks found.
              </p>
            )}

          </section>
        )}

      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
