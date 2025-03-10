"use client";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {GetUserData} from '@/app/helper/userdata';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux';
import { logout } from '@/features/search/searchSlice';
import Link from 'next/link';

import { redirect } from 'next/navigation'
import Cookies from 'js-cookie';
const navigation = [
  { name: 'Dashboard', href: '/', current: true },
  { name: 'Team', href: '/blog', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function Navbar() {
 const userDataFinal= GetUserData();
 const router = useRouter();
 const dispatch = useDispatch();
 
 function handleLogout() {
  // Dispatch action to save user in Redux (if using Redux)
  if (userDataFinal?.isLoggedIn) {
    localStorage.clear();
    Cookies.remove("isLoggedIn");
     dispatch(logout());
     // Use router.push for client-side navigation (prevents reload)
     router.push('/');
  } else {
     // If user is not logged in, navigate to the homepage
     router.push('/');
  }
}

function onClickLink(path:string){
  router.push('/`${path}`');
}
console.log("userDataFinal",userDataFinal)

  return (
    <Disclosure as="nav" className="bg-gray-800 w-full">
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 w-full">
      <div className="relative flex h-16 items-center justify-between w-full">
        
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="h-8 w-auto"
          />
        </div>
  
        {/* Center Section - Navigation */}
        <div className="hidden sm:flex flex-1 justify-center">
          <div className="flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
  
        {/* Right Section - Profile & Notifications */}
        <div className="flex items-center space-x-4">
          {/* Notifications Icon */}
          <button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white">
            <BellIcon aria-hidden="true" className="h-6 w-6" />
          </button>
  
          {/* Profile Dropdown */}
          <Menu as="div" className="relative">
            <div>
              <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white">
                <img
                  alt="User Avatar"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="h-8 w-8 rounded-full"
                />
              </MenuButton>
            </div>
            <MenuItems className="absolute right-0 z-10 mt-2 w-48 bg-white py-1 shadow-lg ring-1 ring-black/5">
              <MenuItem>
                <p className="block px-4 py-2 text-sm text-gray-700">{userDataFinal?.isLoggedIn ? `Hello, ${userDataFinal?.user?.name}` : "Please login"}</p>
              </MenuItem>
              <MenuItem>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              </MenuItem>
              <MenuItem>
                <Button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" onClick={handleLogout}>
                  {userDataFinal?.isLoggedIn ? "Logout" : "Login"}
                </Button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  
    {/* Mobile Menu */}
    <DisclosurePanel className="sm:hidden">
      <div className="space-y-1 px-2 pt-2 pb-3">
        {navigation.map((item) => (
          <DisclosureButton
            key={item.name}
            as="a"
            href={item.href}
            className={classNames(
              item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'block rounded-md px-3 py-2 text-base font-medium',
            )}
          >
            {item.name}
          </DisclosureButton>
        ))}
      </div>
    </DisclosurePanel>
  </Disclosure>
  
  )
}
