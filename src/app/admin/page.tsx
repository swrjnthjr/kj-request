"use client";

import { useState, useEffect } from "react";
import PlayIcon from "@/components/PlayIcon";
import TakenIcon from "@/components/TakenIcon";

interface SongRequest {
  _id: string;
  name: string;
  song: string;
  artist: string;
  message?: string;
  status: "Pending" | "Taken";
  createdAt: string;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRequests = async (filterDate: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/requests?date=${filterDate}`);
      if (!res.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await res.json();
      setRequests(data?.data || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(date);
  }, [date]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleMarkAsTaken = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/requests/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Taken" }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === id ? { ...req, status: "Taken" } : req
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-violet-400 tracking-tight">
            Song Requests Dashboard
          </h1>
        </div>
        <div className="flex justify-between items-center mb-6 text-gray-400">
          <p>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="date-filter">Filter by Date:</label>
            <input
              id="date-filter"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => fetchRequests(date)}
            disabled={isLoading}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2 disabled:bg-violet-800 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.899 2.139l.894.447a1 1 0 01-1.789 1.789l-.894-.447A5.002 5.002 0 005.899 9.101V11a1 1 0 11-2 0V3a1 1 0 011-1zm12 14a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.899-2.139l-.894-.447a1 1 0 111.789-1.789l.894.447A5.002 5.002 0 0014.101 10.899V9a1 1 0 112 0v8a1 1 0 01-1 1z"
                clipRule="evenodd"
              />
            </svg>
            {isLoading ? "Refreshing..." : "Refresh List"}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center mb-4">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-center p-8 text-gray-400">Loading requests...</p>
          ) : requests.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Song Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Artist
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {requests.map((request) => (
                  <tr
                    key={request._id}
                    className={`${
                      request.status === "Taken"
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.song}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.artist}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(request.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.status === "Taken" ? (
                        <TakenIcon />
                      ) : (
                        <span className="text-yellow-400">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status !== "Taken" && (
                        <button
                          onClick={() => handleMarkAsTaken(request._id)}
                          disabled={updatingId === request._id}
                          className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-wait"
                        >
                          {updatingId === request._id ? (
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {updatingId === request._id
                            ? "Updating..."
                            : "Mark as Taken"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center p-8 text-gray-400">
              No requests found for the selected date.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
