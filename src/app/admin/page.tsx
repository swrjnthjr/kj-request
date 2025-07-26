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

  const fetchRequests = async (filterDate: string) => {
    setError(null);
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
    }
  };

  useEffect(() => {
    fetchRequests(date);
  }, [date]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const markAsTaken = async (id: string) => {
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
              onChange={handleDateChange}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
            />
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => fetchRequests(date)}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 rounded-lg text-white font-bold text-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-violet-500/50 shadow-lg hover:shadow-violet-500/40 transform hover:-translate-y-1"
          >
            Refresh List
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center mb-4">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
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
              {requests?.map((request) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.status === "Pending" && (
                      <button
                        onClick={() => markAsTaken(request._id)}
                        className="text-violet-400 hover:text-violet-300"
                      >
                        <PlayIcon />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
