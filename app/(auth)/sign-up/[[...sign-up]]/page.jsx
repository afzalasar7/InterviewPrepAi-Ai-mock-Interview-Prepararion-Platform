"use client"
import { SignUp } from "@clerk/nextjs";
import { SignIn,useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const {isSignedIn}=useAuth();
  const router=useRouter()
  useEffect(()=>{
     if(isSignedIn){
      router.push("/dashboard")
     }
  },[isSignedIn])
  return (
  
<section className="bg-white">
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
  <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
  <img
    alt="sign-up-bg"
    src="https://images.unsplash.com/photo-1653406759381-4d6ca279cab3?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    className="w-full max-h-screen object-cover"
  />
</aside>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl">
        <a className="block text-blue-600" href="#">
          
        </a>

        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
           Welcome to Interview PrepAI🚀
        </h1>

        <p className="mt-4 leading-relaxed text-gray-500">
          
        </p>
        <div className="h-5"></div>

       <SignUp/>
      </div>
    </main>
  </div>
</section>
  )
}