// web-client/app/onboard/page.tsx
"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Send } from "lucide-react";

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
    university_campus: "",
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-taupe-100 via-white to-taupe-100">
        <div className="p-8 text-center font-medium text-slate-500 animate-pulse bg-white border border-slate-100 rounded-2xl shadow-sm">
          Verifying security profile initialization...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-taupe-100 via-white to-taupe-100 p-4 md:p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl shadow-slate-100/70 border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Illustration Container */}
        <div className="md:w-1/2 bg-slate-50 relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-100 flex items-center justify-center min-h-[300px] md:min-h-full">
          <img 
            src="/assets/grass.jpg" 
            alt="Login Illustration" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Interactive Profile Onboarding Form */}
        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight text-center">Complete Your Profile</h1>
            <p className="text-[14px] text-[#7f8185] font-light mt-1 text-center">Please select your primary role profile configuration.</p>
          </div>
          
          {/* Role Selector */}
          <div className="flex space-x-1 mb-6 bg-slate-100/50 p-1.5 rounded-xl border border-slate-200/40">
            {["STUDENT", "POSTER", "CORPORATE"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r as any)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  role === r 
                    ? "bg-white text-[#337d28]  border border-slate-200" 
                    : "text-black hover:text-slate-600 hover:bg-white/50"
                }`}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Phone Number</label>
              <input 
                required 
                name="phone_number" 
                onChange={handleInputChange} 
                className="w-full border-slate-200 bg-white text-[#262626] placeholder-[#c6c6c6] rounded-xl p-3 text-sm border focus:outline-none focus:bg-white   focus:border-gray-400 transition-all" 
                placeholder="0771234567" 
              />
            </div>

            {(role === "STUDENT" || role === "POSTER") && (
              <div>
                <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">National ID (NIC)</label>
                <input 
                  required 
                  name="nic" 
                  onChange={handleInputChange} 
                  className="w-full border-slate-200 bg-white text-[#262626] placeholder-[#c6c6c6] rounded-xl p-3 text-sm border focus:outline-none focus:bg-white   focus:border-gray-400 transition-all" 
                  placeholder="200012345678" 
                />
              </div>
            )}

            {role === "STUDENT" && (
              <>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">University</label>
                  <input 
                    required 
                    name="university_campus" 
                    onChange={handleInputChange} 
                    className="w-full border-slate-200 bg-white text-[#262626] placeholder-[#c6c6c6] rounded-xl p-3 text-sm border focus:outline-none focus:bg-white  focus:border-gray-400 transition-all" 
                    placeholder="University of Moratuwa" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Student ID</label>
                  <input 
                    required 
                    name="encrypted_uni_id" 
                    onChange={handleInputChange} 
                    className="w-full border-slate-200 bg-white text-[#262626] placeholder-[#c6c6c6] rounded-xl p-3 text-sm border focus:outline-none focus:bg-white  focus:border-gray-400 transition-all" 
                    placeholder="200123A" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Faculty</label>
                  <input 
                    required 
                    name="faculty" 
                    onChange={handleInputChange} 
                    className="w-full border-slate-200 bg-white text-[#262626] placeholder-[#c6c6c6] rounded-xl p-3 text-sm border focus:outline-none focus:bg-white   focus:border-gray-400 transition-all" 
                    placeholder="Engineering" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Department</label>
                  <input 
                    required 
                    name="academic_department" 
                    onChange={handleInputChange} 
                    className="w-full border-slate-200 bg-white text-[#262626] placeholder-[#c6c6c6] rounded-xl p-3 text-sm border focus:outline-none focus:bg-white   focus:border-gray-400 transition-all" 
                    placeholder="Computer Science" 
                  />
                </div>
              </>
            )}

            {role === "CORPORATE" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Business Name</label>
                  <input 
                    required 
                    name="business_name" 
                    onChange={handleInputChange} 
                    className="w-full border-slate-200 bg-white text-[#262626] placeholder-[#c6c6c6] rounded-xl p-3 text-sm border focus:outline-none focus:bg-white  focus:border-gray-400 transition-all" 
                    placeholder="Acme Corp" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Registration Number</label>
                  <input 
                    required 
                    name="registration_number" 
                    onChange={handleInputChange} 
                    className="w-full border-slate-200 bg-white text-[#262626] placeholder-[#c6c6c6] rounded-xl p-3 text-sm border focus:outline-none focus:bg-white   focus:border-gray-400 transition-all" 
                    placeholder="PV123456" 
                  />
                </div>
              </>
            )}

            <button
               type="submit"
               disabled={isLoading}
               className="w-full bg-white hover:bg-[#e8e9ec] text-[#28292b] border border-[#afb2b6] py-3 px-4 rounded-xl font-semibold shadow-sm transition-all active:scale-[0.99] mt-6 disabled:opacity-50 disabled:pointer-events-none text-sm flex items-center justify-center gap-2"
            > 
            {isLoading ? ("Saving Profile...") : (<> Complete Registration <Send size={16} /></>)}
             </button>

          </form>
        </div>

      </div>
    </div>
  );
}