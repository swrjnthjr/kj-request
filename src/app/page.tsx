import InstagramLogo from "@/components/InstagramLogo";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-violet-400 tracking-tight">
          Welcome to the Karaoke Night!
        </h1>
        <p className="max-w-md mx-auto text-lg text-gray-400">
          Ready to sing your heart out? Request your favorite song!
        </p>
        <div className="flex flex-col items-center space-y-2">
          <p className="text-gray-400">Follow your KJ on Insta</p>
          <a
            href="https://www.instagram.com/elysiumsmusic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
          >
            <InstagramLogo />
            <span>ELYSIUMSMUSIC</span>
          </a>
        </div>
        <Link href="/request">
          <span className="inline-block px-8 py-4 bg-violet-600 hover:bg-violet-700 rounded-full text-white font-bold text-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-violet-500/50 shadow-lg hover:shadow-violet-500/40 transform hover:-translate-y-1 cursor-pointer">
            Request a Song
          </span>
        </Link>
      </div>
    </main>
  );
}
