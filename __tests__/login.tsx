/**
 * @jest-environment jsdom
 */

import LoginPage from "@/app/(auth)/login/page";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import LoginPage from "@/app/login/page";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe("LoginPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    mockFetch.mockReset();
    pushMock.mockReset();
  });

  it("renders form fields and button", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("submits successfully and redirects to dashboard", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/login", expect.any(Object));
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error message when login fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("disables button and shows loading text while submitting", async () => {
    mockFetch.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 500))
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent(/logging in/i);
  });
});
