import clsx from 'clsx';
import { Link, NavLink } from "@remix-run/react";
import * as React from 'react';

import { Theme, Themed, useTheme } from "~/utils/theme-provider";
import MobileNavigation from '~/components/layout/MobileNavigation'
import Navigation from '~/components/layout/Navigation'
import config from '~/docs.config';

import {SearchPalette} from '~/components/Search';

import {
    MagnifyingGlassIcon
} from '@heroicons/react/24/solid'

import Footer from '~/components/layout/Footer';

const GitHubIcon = (props) => (
    <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
    <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
    </svg>
)

export default function Container({children}) {
    let [isScrolled, setIsScrolled] = React.useState(false)
    let [isSearching, setIsSearching] = React.useState(false);

    const [, setTheme] = useTheme();

    const toggleTheme = () => {
        setTheme((prevTheme) =>
            prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
        );
    };


    React.useEffect(() => {
        function onScroll() {
            setIsScrolled(window.scrollY > 0)
        }
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [])
    return (
        <div>
            <header
                className={clsx(
                'sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8',
                isScrolled
                    ? 'dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
                    : 'dark:bg-transparent'
                )}
            >
                <div className="mr-6 flex lg:hidden">
                    <MobileNavigation />
                </div>
                <div className="relative flex flex-grow basis-0 items-center space-x-3 hidden md:block">
                    <NavLink 
                        to="/"
                        prefetch="intent" 
                        aria-label="Home"
                        className={({ isActive }) =>  clsx(
                            isActive
                            ? 'font-semibold text-sky-500 before:bg-sky-500'
                            : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600  dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
                        )}  
                    >Home</NavLink>
                    {config.nav && config.nav.map( nav => (
                        <NavLink 
                            key={nav.link} 
                            to={nav.link} 
                            prefetch="intent" 
                            aria-label={nav.link}
                            className={({ isActive }) =>  clsx(
                                isActive
                                ? 'font-semibold text-sky-500 before:bg-sky-500'
                                : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600  dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
                            )}  
                        >
                            {nav.text}
                        </NavLink>
                    ))}
                </div>
                <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
                    <Link 
                        to="/" 
                        prefetch="intent"
                        className='dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
                    >
                        {config.title}
                    </Link>
                </div>
                <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow">
                    {config.search.enabled && <>
                        <button
                            onClick={() => setIsSearching(!isSearching)}
                        >
                            <MagnifyingGlassIcon 
                                className="w-8 h-8 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" 
                            />
                        </button>
                        {isSearching && <SearchPalette open={isSearching} setOpen={setIsSearching} />}
                    </>}
                    {config.editLink.enabled && <>
                        {config.editLink.link && <a href={config.editLink.link} className="group" aria-label="GitHub">
                            <GitHubIcon className="h-8 w-8 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" />
                        </a>}
                    </>}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle Dark Mode"
                        type="button"
                        className="w-8 h-8 bg-gray-200 rounded-lg dark:bg-gray-600 flex items-center justify-center  hover:ring-2 ring-gray-300  transition-all"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-800 dark:text-gray-200"
                        >
                            <Themed
                                dark={<path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                />}
                                light={<path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />}
                            />
                        </svg>
                    </button>
                </div>
            </header>
            <div className="relative mx-auto flex max-w-8xl justify-center sm:px-2 lg:px-8 xl:px-12 bg-white dark:bg-gray-800">
                <div className="hidden lg:relative lg:block lg:flex-none">
                    <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden " />
                    <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto py-16 pl-0.5">
                        <div className="absolute top-16 bottom-0 right-0 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block dark:bg-slate-500" />
                        <div className="absolute top-28 bottom-0 right-0 hidden w-px bg-slate-800 dark:block dark:bg-slate-500" />
                        <Navigation
                            navigation={config.sidebar}
                            className="w-64 pr-8 xl:w-72 xl:pr-16"
                        />
                    </div>
                </div>
                <div className="min-w-0 max-w-2xl flex-auto px-4 py-6 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
                    <div className="prose w-full min-w-full">
                        {children}
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}