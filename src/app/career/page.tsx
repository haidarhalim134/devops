"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, Clock, Trash2, Pencil, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ---------- Types ----------
interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

// ---------- Main Page ----------
export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description:
        "Build modern and responsive web interfaces using React, Next.js, and Tailwind CSS.",
    },
    {
      id: 2,
      title: "UI/UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Hybrid",
      description:
        "Design user-centric interfaces and contribute to brand design systems.",
    },
  ]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // ---------- Check for admin cookie ----------
//   useEffect(() => {
//     const isAdminCookie = document.cookie.includes("admin=true");
//     setIsAdmin(isAdminCookie);
//   }, []);
    useEffect(() => {
        fetch("/api/auth/verify")
        .then((res) => res.json())
        .then((data) => setIsAdmin(data.isAdmin));
    }, []);

  // ---------- Handlers ----------
  const handleDelete = (id: number) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const handleEditOpen = (job: Job) => {
    setSelectedJob(job);
    setEditDialog(true);
  };

  const handleEditSave = () => {
    if (selectedJob) {
      setJobs((prev) =>
        prev.map((job) => (job.id === selectedJob.id ? selectedJob : job))
      );
      setEditDialog(false);
    }
  };

  const handleCreateSave = () => {
    if (selectedJob) {
      const newJob = { ...selectedJob, id: Date.now() };
      setJobs((prev) => [...prev, newJob]);
      setCreateDialog(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 relative">
      {/* Header */}
      <section className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 transition-all duration-300">
          Join Our Team
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We’re always looking for talented people to grow with us. Explore open
          roles and become part of a passionate team shaping the future.
        </p>
      </section>

      {/* Job Cards */}
      <section className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <Card className="h-full hover:shadow-lg transition-shadow relative">
              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditOpen(job)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(job.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}

              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {job.department}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={16} /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} /> {job.type}
                  </span>
                </div>

                <Button className="w-full">
                  <Briefcase size={16} className="mr-2" /> Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </section>

      {/* Floating + Button */}
      {isAdmin && (
        <Button
          size="icon"
          className="fixed bottom-10 right-10 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg"
          onClick={() => {
            setSelectedJob({
              id: 0,
              title: "",
              department: "",
              location: "",
              type: "",
              description: "",
            });
            setCreateDialog(true);
          }}
        >
          <Plus size={24} />
        </Button>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-3">
              <Input
                placeholder="Job Title"
                value={selectedJob.title}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, title: e.target.value })
                }
              />
              <Input
                placeholder="Department"
                value={selectedJob.department}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, department: e.target.value })
                }
              />
              <Input
                placeholder="Location"
                value={selectedJob.location}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, location: e.target.value })
                }
              />
              <Input
                placeholder="Type"
                value={selectedJob.type}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, type: e.target.value })
                }
              />
              <Textarea
                placeholder="Description"
                value={selectedJob.description}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, description: e.target.value })
                }
              />
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-3">
              <Input
                placeholder="Job Title"
                value={selectedJob.title}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, title: e.target.value })
                }
              />
              <Input
                placeholder="Department"
                value={selectedJob.department}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, department: e.target.value })
                }
              />
              <Input
                placeholder="Location"
                value={selectedJob.location}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, location: e.target.value })
                }
              />
              <Input
                placeholder="Type"
                value={selectedJob.type}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, type: e.target.value })
                }
              />
              <Textarea
                placeholder="Description"
                value={selectedJob.description}
                onChange={(e) =>
                  setSelectedJob({ ...selectedJob, description: e.target.value })
                }
              />
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleCreateSave}>Create Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
