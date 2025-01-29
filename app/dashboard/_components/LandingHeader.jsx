"use client"
import Image from 'next/image'
import React, { useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'

function LandingHeader() {
return(
<div className="flex p-4 items-center justify-between bg-gray-900">
  <Image src={'/logo.svg'} width={45} height={45} alt="logo" />

  <ul className="hidden md:flex gap-8">
  <li>
    <a 
      href="#about" 
      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 text-lg font-extrabold tracking-wider transform transition-transform hover:scale-110 hover:rotate-1 hover:skew-x-3 hover:shadow-lg hover:shadow-blue-500/50"
    >
      About Us 
    </a>
  </li>
  <li>
    <a 
      href="#feature" 
      className="text-transparent bg-clip-text bg-gradient-to-r  from-blue-400 via-blue-500 to-purple-500 text-lg font-extrabold tracking-wider transform transition-transform hover:scale-110 hover:rotate-1 hover:skew-x-3 hover:shadow-lg hover:shadow-blue-500/50"
    >
       Features
    </a>
  </li>
</ul>
  <UserButton />
</div>

)
}
export default LandingHeader