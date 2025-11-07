"use client";
import { useEffect, useState } from "react";
import { Trash, Pen, Plus, Loader2 } from "lucide-react"; // 👈 added Loader2
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true); // 👈 new state

  // Fetch admin status
  useEffect(() => {
    fetch("/api/auth/verify")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin));
  }, []);

  // Fetch jobs
  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .finally(() => setLoading(false)); // 👈 hide spinner once done
  }, []);

  async function deleteJob(id: number) {
    if (!confirm("Are you sure you want to delete this job?")) return;
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }

  async function addJob(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const newJob = await res.json();
      setJobs((prev) => [...prev, newJob]);
      setShowDialog(false);
      e.currentTarget.reset();
    }
  }

  async function updateJob(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingJob) return;
    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());
    const res = await fetch(`/api/jobs/${editingJob.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = await res.json();
      setJobs((prev) =>
        prev.map((job) => (job.id === updated.id ? updated : job))
      );
      setEditingJob(null);
      setShowDialog(false);
    }
  }

  function handleEdit(job: Job) {
    setEditingJob(job);
    setShowDialog(true);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 relative">
      <h1 className="text-4xl font-bold text-center mb-8">Join Our Team</h1>

      {/* 👇 Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <section className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="relative hover:shadow-md">
              <CardContent className="p-6">
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Pen size={18} />
                    </button>
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{job.department}</p>
                <p className="text-gray-600 text-sm mb-4">{job.description}</p>
                <div className="text-sm text-gray-500">
                  {job.location} • {job.type}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {/* 👇 Admin floating button + dialog stays the same */}
      {isAdmin && (
        <>
          <button
            onClick={() => {
              setEditingJob(null);
              setShowDialog(true);
            }}
            className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700"
          >
            <Plus size={24} />
          </button>

          {showDialog && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <form
                onSubmit={editingJob ? updateJob : addJob}
                className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
              >
                <h2 className="text-xl font-semibold mb-4">
                  {editingJob ? "Edit Job" : "Create Job"}
                </h2>

                <input
                  name="title"
                  placeholder="Job title"
                  defaultValue={editingJob?.title}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  name="department"
                  placeholder="Department"
                  defaultValue={editingJob?.department}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  name="location"
                  placeholder="Location"
                  defaultValue={editingJob?.location}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  name="type"
                  placeholder="Type (Full-time / Part-time)"
                  defaultValue={editingJob?.type}
                  className="w-full border p-2 rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  defaultValue={editingJob?.description}
                  className="w-full border p-2 rounded"
                  required
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowDialog(false);
                      setEditingJob(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingJob ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </main>
  );
}
