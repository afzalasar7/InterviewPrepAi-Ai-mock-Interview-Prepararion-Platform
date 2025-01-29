import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import React from 'react'
import Image from 'next/image'
import Link from "next/link";
function Footer() {
  return (
    <footer className="flex flex-col items-center bg-zinc-50 text-center text-surface dark:bg-neutral-700 dark:text-white">
      <div className="container px-6 pt-6">
        <div className="mb-6 flex justify-center space-x-2">
          

          <a
          href="https://linkedin.com/in/afzalasar"
          type="button"
            target="_blank"
            className="rounded-full bg-[#55acee] p-3 uppercase leading-normal text-white shadow-dark-3 shadow-black/30 transition duration-150 ease-in-out hover:shadow-dark-1 focus:shadow-dark-1 focus:outline-none focus:ring-0 active:shadow-1 dark:text-white"
            data-twe-ripple-init
            data-twe-ripple-color="light"
          >
                      <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />

          </a>

          <a
          href="https://github.com/afzalasar7"
          target="_blank"
            type="button"
            className="rounded-full bg-[#333333] p-3 uppercase leading-normal text-white shadow-dark-3 shadow-black/30 transition duration-150 ease-in-out hover:shadow-dark-1 focus:shadow-dark-1 focus:outline-none focus:ring-0 active:shadow-1 dark:text-white"
            data-twe-ripple-init
            data-twe-ripple-color="light"
          >
                      <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />

          </a>

          <a
            href="mailto:afzalasar5@gmail.com"
            type="button"
            className="rounded-full bg-[#dd4b39] p-3 uppercase leading-normal text-white shadow-dark-3 shadow-black/30 transition duration-150 ease-in-out hover:shadow-dark-1 focus:shadow-dark-1 focus:outline-none focus:ring-0 active:shadow-1 dark:text-white"
            data-twe-ripple-init
            data-twe-ripple-color="light"
          >
            <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 488 512"
              >
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      <div className="w-full bg-black/5 p-4 text-center">
      Copyright &copy; {new Date().getFullYear()} Afzal Asar. All rights reserved.

      </div>
    </footer>
  );
}

export default Footer;
