"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import InstagramLogo from "@/components/InstagramLogo";

export default function UserRequest() {
  const [name, setName] = useState("");
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !song || !artist) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, song, artist, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-violet-400 tracking-tight">
            Song Request
          </h1>
          <p className="text-gray-400 mt-2">
            Send your favorite tunes to the KJ
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label
              htmlFor="song"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Song Title
            </label>
            <input
              id="song"
              type="text"
              value={song}
              onChange={(e) => setSong(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
              placeholder="e.g., Bohemian Rhapsody"
            />
          </div>
          <div>
            <label
              htmlFor="artist"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Artist
            </label>
            <input
              id="artist"
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
              placeholder="e.g., Queen"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
              placeholder="Any special dedication?"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 rounded-md text-white font-bold text-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-violet-500/50 shadow-lg hover:shadow-violet-500/40 transform hover:-translate-y-0.5"
          >
            Send Request
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col items-center space-y-2">
          <p className="text-gray-400">Follow your KJ on Insta</p>
          <a
            href="https://www.instagram.com/elysiumsmusic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            <InstagramLogo />
          </a>
        </div>
      </div>
    </main>
  );
}
