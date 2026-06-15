// web-client/app/onboard/page.tsx
"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "POSTER" | "CORPORATE">("STUDENT");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    phone_number: "",
    nic: "",
    encrypted_uni_id: "",
    faculty: "",
    university_campus: "University of Moratuwa",
    academic_department: "",
    business_name: "",
    registration_number: "",
  });

  // Check if user is already registered in the databases
  useEffect(() => {
    async function checkExistingUser() {
      if (!isLoaded || !user) return;

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          // User already exists in database, bypass onboarding page
          router.push("/");
        } else {
          // User doesn't exist (404), allow them to fill out the form
          setIsCheckingUser(false);
        }
      } catch (err) {
        console.error("Error checking user existence:", err);
        setIsCheckingUser(false);
      }
    }

    checkExistingUser();
  }, [user, isLoaded, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    const basePayload = {
      clerk_id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      phone_number: formData.phone_number,
      display_name: user.fullName || "User",
    };

    let endpoint = "";
    let finalPayload = {};

    if (role === "STUDENT") {
      endpoint = "/register/student";
      finalPayload = {
        ...basePayload,
        encrypted_uni_id: formData.encrypted_uni_id,
        faculty: formData.faculty,
        nic: formData.nic,
        university_campus: formData.university_campus,
        academic_department: formData.academic_department,
        skill_tags: [],
      };
    } else if (role === "POSTER") {
      endpoint = "/register/poster";
      finalPayload = { ...basePayload, nic: formData.nic };
    } else if (role === "CORPORATE") {
      endpoint = "/register/corporate";
      finalPayload = {
        ...basePayload,
        business_name: formData.business_name,
        registration_number: formData.registration_number,
      };
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/auth${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (res.ok) {
        // Clear caches and go home
        window.location.href = "/"; 
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.detail}`);
      }
    } catch (err) {
      console.error("Failed to register:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || isCheckingUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="p-8 text-center font-medium text-gray-600 animate-pulse">
          Verifying security profile initialization...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Complete Your Profile</h1>
        
        {/* Role Selector */}
        <div className="flex space-x-2 mb-8 bg-gray-100 p-1 rounded-lg">
          {["STUDENT", "POSTER", "CORPORATE"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r as any)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                role === r ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input required name="phone_number" onChange={handleInputChange} className="w-full border-gray-300 rounded-md p-2 border focus:ring-blue-500 focus:border-blue-500" placeholder="0771234567" />
          </div>

          {(role === "STUDENT" || role === "POSTER") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">National ID (NIC)</label>
              <input required name="nic" onChange={handleInputChange} className="w-full border-gray-300 rounded-md p-2 border focus:ring-blue-500 focus:border-blue-500" placeholder="200012345678" />
            </div>
          )}

          {role === "STUDENT" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input required name="encrypted_uni_id" onChange={handleInputChange} className="w-full border-gray-300 rounded-md p-2 border focus:ring-blue-500 focus:border-blue-500" placeholder="200123A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                <input required name="faculty" onChange={handleInputChange} className="w-full border-gray-300 rounded-md p-2 border focus:ring-blue-500 focus:border-blue-500" placeholder="Engineering" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input required name="academic_department" onChange={handleInputChange} className="w-full border-gray-300 rounded-md p-2 border focus:ring-blue-500 focus:border-blue-500" placeholder="Computer Science" />
              </div>
            </>
          )}

          {role === "CORPORATE" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input required name="business_name" onChange={handleInputChange} className="w-full border-gray-300 rounded-md p-2 border focus:ring-blue-500 focus:border-blue-500" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                <input required name="registration_number" onChange={handleInputChange} className="w-full border-gray-300 rounded-md p-2 border focus:ring-blue-500 focus:border-blue-500" placeholder="PV123456" />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium transition-colors mt-6 disabled:opacity-50"
          >
            {isLoading ? "Saving Profile..." : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}