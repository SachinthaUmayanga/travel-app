"use client"
import { navLinks } from '@/constant/constant'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { HiBars3BottomRight } from 'react-icons/hi2'
import { TbAirBalloon } from 'react-icons/tb'
import { useSession, signOut } from 'next-auth/react'

const AuthButton = () => {
    const { data: session, status } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    if (status === "loading") {
        return <div className="text-white">...</div>;
    }

    if (session) {
        return (
            <div className="relative flex items-center space-x-3">
                {(session.user as any)?.role === 'admin' && (
                    <Link href="/admin">
                        <button className='md:px-4 md:py-2.5 px-2 py-2 text-white border border-white hover:bg-white hover:text-black transition-all duration-200 rounded-lg hidden lg:block'>
                            Dashboard
                        </button>
                    </Link>
                )}
                
                <div 
                    className="relative cursor-pointer hover:opacity-80 transition"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    {session.user?.image ? (
                        <img src={session.user.image} alt="Profile" className="w-10 h-10 rounded-full border-2 border-yellow-300" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold border-2 border-yellow-300">
                            {session.user?.name?.charAt(0) || "U"}
                        </div>
                    )}
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div className="absolute right-0 top-14 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {session.user?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {session.user?.email || ""}
                            </p>
                        </div>
                        <Link 
                            href="/profile"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Account Settings
                            </div>
                        </Link>
                        <button 
                            onClick={() => signOut({ callbackUrl: '/' })} 
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link href="/admin/login">
            <button className='md:px-8 md:py-2.5 px-4 py-2 text-white border border-white hover:bg-white hover:text-black transition-all duration-200 rounded-lg hidden lg:block'>
                Login
            </button>
        </Link>
    );
};

type Props = {
    openNav: () => void
}

const Nav = ({openNav}:Props) => {

    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    useEffect(() => {
        const handler = () => {
            if (window.scrollY >= 90) setScrolled(true);
            if (window.scrollY < 90) setScrolled(false);
        };
        
        // Run once on mount to check initial scroll
        handler();
        
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, [])
    
    const navBg = !isHomePage || scrolled;

    return (
        <div className={`${navBg ? 'bg-blue-950 shadow-md' : 'fixed'} transition-all duration-200 h-[12vh] z-[1000] fixed w-full`}>
            <div className='flex items-center h-full justify-between w-[90%] xl:w-[80%] mx-auto'>
                {/* Logo */}
                <Link href="/">
                    <div className='flex items-center space-x-2 cursor-pointer'>
                        <div className='w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center flex-col'>
                            <TbAirBalloon className='w-6 h-6 text-white' />
                        </div>

                        <h1 className='text-xl md:text-2xl text-white uppercase font-bold'>
                            Travel.
                        </h1>
                    </div>
                </Link>

                {/* Navbar */}
                <div className='hidden lg:flex items-center space-x-10'>
                    {navLinks.map((link) => {
                        return (
                            <Link href={link.url} key={link.id}>
                                <p className='relative text-white text-base font-medium w-fit block after:block after:content-[""] after:absolute after:h-[3px] after:bg-yellow-300 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition duration-300 after:origin-right'>
                                    {link.label}
                                </p>
                            </Link>
                        ); 
                    })}
                </div>

                {/* Buttons */}
                <div className='flex items-center space-x-4'>
                    <button className='md:px-12 md:py-2.5 px-8 py-2 text-black text-base bg-white hover:bg-gray-200 transition-all duration-200 rounded-lg'>
                        Book Now
                    </button>
                    <AuthButton />

                    {/* Burger Menu */}
                    <HiBars3BottomRight onClick={openNav} className='w-8 h-8 cursor-pointer text-white lg:hidden' />
                </div>
            </div>
        </div>
    )
}

export default Nav
