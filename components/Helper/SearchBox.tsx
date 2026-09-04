'use client';

import React, { useState, useEffect, useRef } from 'react'
import { FaCalendarWeek, FaMap } from 'react-icons/fa'
import { FaUserGroup } from 'react-icons/fa6'

const SearchBox = () => {
    const [location, setLocation] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const locationRef = useRef<HTMLDivElement>(null);

    const [guests, setGuests] = useState({ adults: 1, children: 0, rooms: 1 });
    const [isGuestOpen, setIsGuestOpen] = useState(false);
    const guestRef = useRef<HTMLDivElement>(null);

    // Fetch location suggestions
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                let url = '/api/locations';
                if (location.trim() !== '') {
                    url = `/api/locations?q=${encodeURIComponent(location)}`;
                }
                const res = await fetch(url);
                if (res.ok) {
                    setSuggestions(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch locations:", error);
            }
        };

        const debounce = setTimeout(() => {
            fetchLocations();
        }, 300);

        return () => clearTimeout(debounce);
    }, [location]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
                setIsLocationOpen(false);
            }
            if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
                setIsGuestOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const totalGuests = guests.adults + guests.children;

    return (
        <div className='bg-white rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-center gap-8 mt-4 sm:mt-12 w-[95%] sm:w-[80%] relative z-40'>
            {/* 1st Search Input: Location */}
            <div className='flex items-center space-x-6 relative' ref={locationRef}>
                <FaMap className='w-6 h-6 text-blue-600 flex-shrink-0' />
                <div className='w-full'>
                    <p className='text-lg font-medium mb-[0.2rem]'>Location</p>
                    <input type="text" 
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            setIsLocationOpen(true);
                        }}
                        onFocus={() => setIsLocationOpen(true)}
                        placeholder='Where are you going?' 
                        className='outline-none border-none placeholder:text-gray-800 w-full text-base' 
                    />
                </div>
                {isLocationOpen && suggestions.length > 0 && (
                    <div className='absolute top-full left-0 mt-4 w-[250px] bg-white shadow-2xl rounded-lg z-50 max-h-60 overflow-y-auto border border-gray-100'>
                        {suggestions.map((sug, idx) => (
                            <div 
                                key={idx} 
                                className='px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors text-gray-800 border-b border-gray-50 last:border-b-0'
                                onClick={() => {
                                    setLocation(sug);
                                    setIsLocationOpen(false);
                                }}
                            >
                                {sug}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 2nd Search Input: Start Date */}
            <div className='flex items-center space-x-6'>
                <FaCalendarWeek className='w-6 h-6 text-blue-600 flex-shrink-0' />
                <div className='w-full'>
                    <p className='text-lg font-medium mb-[0.2rem]'>Start Date</p>
                    <input type="date"
                        placeholder='Start Date'
                        className='outline-none border-none placeholder:text-gray-800 w-full text-base' 
                    />
                </div>
            </div>

            {/* 3rd Search Input: End Date */}
            <div className='flex items-center space-x-6'>
                <FaCalendarWeek className='w-6 h-6 text-blue-600 flex-shrink-0' />
                <div className='w-full'>
                    <p className='text-lg font-medium mb-[0.2rem]'>End Date</p>
                    <input type="date"
                        placeholder='End Date'
                        className='outline-none border-none placeholder:text-gray-800 w-full text-base' 
                    />
                </div>
            </div>

            {/* 4th Search Input: Guest */}
            <div className='flex items-center space-x-6 relative cursor-pointer' ref={guestRef} onClick={() => setIsGuestOpen(!isGuestOpen)}>
                <FaUserGroup className='w-6 h-6 text-blue-600 flex-shrink-0' />
                <div className='w-full select-none'>
                    <p className='text-lg font-medium mb-[0.2rem]'>Guest</p>
                    <p className='text-base font-normal text-gray-800'>{totalGuests} Guest{totalGuests !== 1 ? 's' : ''} {guests.rooms} Room{guests.rooms !== 1 ? 's' : ''}</p>
                </div>
                {isGuestOpen && (
                    <div className='absolute top-full right-0 sm:left-0 mt-4 w-72 bg-white shadow-2xl rounded-lg z-50 border border-gray-100 p-5' onClick={(e) => e.stopPropagation()}>
                        {/* Adults */}
                        <div className='flex justify-between items-center mb-5'>
                            <div>
                                <h3 className='font-semibold text-gray-800'>Adults</h3>
                                <p className='text-xs text-gray-500'>Ages 13 or above</p>
                            </div>
                            <div className='flex items-center space-x-4'>
                                <button onClick={() => setGuests(prev => ({...prev, adults: Math.max(1, prev.adults - 1)}))} className='w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition'>-</button>
                                <span className='w-4 text-center font-medium'>{guests.adults}</span>
                                <button onClick={() => setGuests(prev => ({...prev, adults: prev.adults + 1}))} className='w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition'>+</button>
                            </div>
                        </div>
                        {/* Children */}
                        <div className='flex justify-between items-center mb-5'>
                            <div>
                                <h3 className='font-semibold text-gray-800'>Children</h3>
                                <p className='text-xs text-gray-500'>Ages 0-12</p>
                            </div>
                            <div className='flex items-center space-x-4'>
                                <button onClick={() => setGuests(prev => ({...prev, children: Math.max(0, prev.children - 1)}))} className='w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition'>-</button>
                                <span className='w-4 text-center font-medium'>{guests.children}</span>
                                <button onClick={() => setGuests(prev => ({...prev, children: prev.children + 1}))} className='w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition'>+</button>
                            </div>
                        </div>
                        {/* Rooms */}
                        <div className='flex justify-between items-center pt-4 border-t border-gray-100'>
                            <div>
                                <h3 className='font-semibold text-gray-800'>Rooms</h3>
                            </div>
                            <div className='flex items-center space-x-4'>
                                <button onClick={() => setGuests(prev => ({...prev, rooms: Math.max(1, prev.rooms - 1)}))} className='w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition'>-</button>
                                <span className='w-4 text-center font-medium'>{guests.rooms}</span>
                                <button onClick={() => setGuests(prev => ({...prev, rooms: prev.rooms + 1}))} className='w-8 h-8 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition'>+</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchBox
