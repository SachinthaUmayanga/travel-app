"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, status, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        await update({ name });
        setMessage({ text: "Profile updated successfully!", type: "success" });
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to update profile", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An unexpected error occurred", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen pt-[15vh] flex justify-center"><p>Loading profile...</p></div>;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-[15vh] bg-gray-50 flex justify-center pb-12">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg h-fit">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Profile</h1>
        
        <div className="flex justify-center mb-8">
          {session.user.image ? (
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-blue-100 shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold">
              {session.user.name?.charAt(0) || "U"}
            </div>
          )}
        </div>

        {message.text && (
          <div className={`p-3 mb-6 rounded text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={session.user.email || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed as it is linked to your Google account.</p>
          </div>

          <div className="pt-4 flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isSaving || (session.user as any).role === 'admin'}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full bg-red-50 text-red-600 border border-red-200 font-semibold py-3 rounded-lg hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
