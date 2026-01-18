// import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
   <div>hh
        <h1>ky haal</h1>
        <button>Click me**</button>
        <Link href="/dashboard">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Go to Auth
      </button>
    </Link>
   </div>

  );
}
