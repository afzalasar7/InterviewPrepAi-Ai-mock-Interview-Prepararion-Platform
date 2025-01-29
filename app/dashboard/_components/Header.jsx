"use client"
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

function Header() {
    const path = usePathname();
    const router =useRouter()
    useEffect(()=>{
        console.log(path)
    },[])
    function getRoutLink(path){
       router.push(path)
    }

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
{/* Logo with onClick to navigate to home */}     
              <Image 
                src={'/logo.svg'} 
                width={45} 
                height={45} 
                alt='logo' 
                onClick={() => getRoutLink('/')} // Adding onClick to navigate to home
                className="cursor-pointer" // Optional: to indicate it's clickable
            />      <ul className='hidden md:flex gap-6'>
      
        <li onClick={()=>getRoutLink('/dashboard')} className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard'&&'text-primary font-bold'}`}>Dashboard</li>
       
        <li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
  <a href="/#about">About</a>
</li>
<li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
  <a href="/#feature">Features</a>
</li>

        {/* Adding Resume Analyzer link */}
        <li onClick={()=>getRoutLink('/resume-analyzer')} className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard/resume-analyzer'&&'text-primary font-bold'}`}>Resume Analyzer</li>
      </ul>
      <UserButton/>
    </div>
  )
}

export default Header
