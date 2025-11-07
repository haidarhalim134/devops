/**
 * @jest-environment jsdom
 */

import CareersPage from "@/app/career/page";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import React from "react";

// Mock Next.js "use client" components
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

// Mock icons
jest.mock("lucide-react", () => ({
  Trash: () => <span data-testid="trash-icon" />,
  Pen: () => <span data-testid="pen-icon" />,
  Plus: () => <span data-testid="plus-icon" />,
  Loader2: () => <span data-testid="loader" />,
}));

// Mock confirm dialog
global.confirm = jest.fn(() => true);

describe("CareersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders jobs after fetch", async () => {
    (global.fetch as jest.Mock) = jest
      .fn()
      // verify admin
      .mockResolvedValueOnce({ json: () => Promise.resolve({ isAdmin: false }) })
      // fetch jobs
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve([
            {
              id: 1,
              title: "Frontend Developer",
              department: "Engineering",
              location: "Remote",
              type: "Full-time",
              description: "Build amazing UIs",
            },
          ]),
      });

    await act(async () => {
      render(<CareersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    });
  });

  it("shows admin buttons when user is admin", async () => {
    (global.fetch as jest.Mock) = jest
      .fn()
      // admin verify
      .mockResolvedValueOnce({ json: () => Promise.resolve({ isAdmin: true }) })
      // jobs
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve([
            {
              id: 2,
              title: "Backend Engineer",
              department: "Tech",
              location: "New York",
              type: "Full-time",
              description: "APIs and databases",
            },
          ]),
      });

    await act(async () => {
      render(<CareersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
    });

    expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
    expect(screen.getByTestId("pen-icon")).toBeInTheDocument();
    expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
  });

  it("deletes a job when admin clicks delete", async () => {
    (global.fetch as jest.Mock) = jest
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve({ isAdmin: true }) })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve([
            {
              id: 3,
              title: "QA Engineer",
              department: "Quality",
              location: "Berlin",
              type: "Full-time",
              description: "Ensure software quality",
            },
          ]),
      })
      .mockResolvedValueOnce({ ok: true });

    await act(async () => {
      render(<CareersPage />);
    });

    await waitFor(() =>
      expect(screen.getByText("QA Engineer")).toBeInTheDocument()
    );

    const deleteBtn = screen.getByTestId("trash-icon").closest("button");
    await act(async () => {
      fireEvent.click(deleteBtn!);
    });

    await waitFor(() =>
      expect(screen.queryByText("QA Engineer")).not.toBeInTheDocument()
    );
  });

  it("opens create job dialog when admin clicks plus button", async () => {
    (global.fetch as jest.Mock) = jest
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve({ isAdmin: true }) })
      .mockResolvedValueOnce({ json: () => Promise.resolve([]) });

    await act(async () => {
      render(<CareersPage />);
    });

    await waitFor(() => screen.getByTestId("plus-icon"));

    const plusBtn = screen.getByTestId("plus-icon").closest("button")!;
    await act(async () => {
      fireEvent.click(plusBtn);
    });

    expect(screen.getByText("Create Job")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Job title")).toBeInTheDocument();
  });
});
