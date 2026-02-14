import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 flex flex-col items-center justify-center text-center px-6">
      
      <div className="mb-10">
        <Image
          src="/logo.png"
          alt="UniSpace Logo"
          width={140}
          height={140}
          className="mx-auto"
        />
      </div>

      <h1 className="text-5xl font-bold text-gray-900">
        Welcome to <span className="text-gray-600">UniSpace</span>
      </h1>

      <p className="mt-6 text-lg max-w-xl text-gray-700">
        Faculty classroom reservation system for students,
        teachers and administrators.
      </p>

      <div className="mt-12">
        <Link
          href="/login"
          className="px-8 py-3 bg-gray-600 text-white rounded-xl shadow-md hover:bg-gray-700 transition duration-300"
        >
          Login
        </Link>
      </div>

    </div>
  );
}