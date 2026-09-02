"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Country, City } from "country-state-city";
import Select from "react-select";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    dob: "",
    emergencyContact: "",
    preferredCurrency: "USD",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const allCountries = useMemo(() => Country.getAllCountries(), []);
  
  const availableCities = useMemo(() => {
    const selectedCountry = allCountries.find(c => c.name === formData.country);
    if (selectedCountry) {
      return City.getCitiesOfCountry(selectedCountry.isoCode) || [];
    }
    return [];
  }, [formData.country, allCountries]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    
    const fetchProfile = async () => {
      if (session?.user && (session.user as any).role !== 'admin') {
        try {
          const res = await fetch('/api/user/profile');
          if (res.ok) {
            const data = await res.json();
            setFormData({
              name: data.name || "",
              phone: data.phone || "",
              address: data.address || "",
              city: data.city || "",
              country: data.country || "",
              dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : "",
              emergencyContact: data.emergencyContact || "",
              preferredCurrency: data.preferredCurrency || "USD",
            });
          }
        } catch (error) {
          console.error("Failed to load profile", error);
        }
      } else if (session?.user?.name) {
         setFormData(prev => ({...prev, name: session.user.name as string}));
      }
      setIsLoading(false);
    };

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [session, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (countryName: string) => {
    const countryData = allCountries.find(c => c.name === countryName);
    
    setFormData(prev => ({
      ...prev,
      country: countryName,
      city: "", // Reset city when country changes
      // If phone is empty or we just want to help them start typing
      phone: countryData && (!prev.phone || prev.phone.trim() === "") ? `+${countryData.phonecode} ` : prev.phone,
      // Automatically update preferred currency but user can still change it manually
      preferredCurrency: countryData?.currency || prev.preferredCurrency
    }));
  };

  const countryOptions = useMemo(() => allCountries.map(c => ({ value: c.name, label: c.name })), [allCountries]);
  const cityOptions = useMemo(() => availableCities.map(c => ({ value: c.name, label: c.name })), [availableCities]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await update({ name: formData.name });
        setMessage({ text: "Profile updated successfully!", type: "success" });
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to update profile", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An unexpected error occurred", type: "error" });
    } finally {
      setIsSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="min-h-screen pt-[15vh] flex justify-center"><p className="text-xl font-semibold text-gray-500">Loading your profile...</p></div>;
  }

  if (!session?.user) {
    return null;
  }

  const isAdmin = (session.user as any).role === 'admin';

  return (
    <div className="min-h-screen pt-10 bg-gray-50 flex justify-center pb-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl h-fit border border-gray-100">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8 border-b pb-6">
          <div className="flex items-center space-x-6">
            {session.user.image ? (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-blue-50 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-blue-300 text-white flex items-center justify-center text-4xl font-bold shadow-md">
                {session.user.name?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{session.user.name || "Your Profile"}</h1>
              <p className="text-gray-500 mt-1">{session.user.email}</p>
              {isAdmin && <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wide">Administrator</span>}
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex space-x-4">
             <button
                type="button"
                onClick={() => router.push('/')}
                className="bg-gray-50 text-gray-700 border border-gray-200 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition shadow-sm"
              >
                Back to Home
              </button>
             <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-50 text-red-600 border border-red-200 font-semibold py-2 px-6 rounded-lg hover:bg-red-100 transition shadow-sm"
              >
                Logout
              </button>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 mb-8 rounded-lg font-medium text-center shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Personal Information</h2>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isAdmin}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={isAdmin}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isAdmin}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition"
                />
                <p className="text-xs text-gray-500 mt-1">Country code updates automatically when selecting a country.</p>
              </div>
            </div>

            {/* Address & Preferences */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Location & Preferences</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isAdmin}
                    placeholder="123 Travel St"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Country</label>
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(o => o.value === formData.country) || null}
                    onChange={(option) => handleCountryChange(option ? option.value : "")}
                    isDisabled={isAdmin}
                    placeholder="Search Country..."
                    styles={{
                      control: (base) => ({ ...base, padding: '2px', borderRadius: '0.5rem', borderColor: '#D1D5DB' })
                    }}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">City</label>
                  <Select
                    options={cityOptions}
                    value={cityOptions.find(o => o.value === formData.city) || null}
                    onChange={(option) => setFormData(prev => ({ ...prev, city: option ? option.value : "" }))}
                    isDisabled={isAdmin || !formData.country}
                    placeholder={formData.country ? "Search City..." : "Select a country first"}
                    styles={{
                      control: (base) => ({ ...base, padding: '2px', borderRadius: '0.5rem', borderColor: '#D1D5DB' })
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Preferred Currency</label>
                    <select
                      name="preferredCurrency"
                      value={formData.preferredCurrency}
                      onChange={handleChange}
                      disabled={isAdmin}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition"
                    >
                      {/* Popular Currencies First */}
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="AUD">AUD ($)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="LKR">LKR (Rs)</option>
                      {/* Render dynamically picked currency if it's not in the list above to prevent blank selects */}
                      {formData.preferredCurrency && !['USD','EUR','GBP','AUD','CAD','JPY','LKR'].includes(formData.preferredCurrency) && (
                        <option value={formData.preferredCurrency}>{formData.preferredCurrency}</option>
                      )}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Updates based on country, but can be changed manually.</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Emergency Contact</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      disabled={isAdmin}
                      placeholder="Name & Number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition"
                    />
                  </div>
              </div>
            </div>
            
          </div>

          <div className="border-t pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSaving || isAdmin}
              className="bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving Changes..." : "Save All Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
