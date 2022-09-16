
import clsx from 'clsx';
import { Link, NavLink } from "@remix-run/react";
import * as React from 'react';
  
import { Dialog } from '@headlessui/react'
import config from '~/docs.config';

export default function Navigation({ navigation, className }) {
    return (
      <nav className={clsx('text-base lg:text-sm', className)}>
        <ul role="list" className="space-y-9">
          {navigation && navigation.map((section) => (
            <li key={section.title}>
              <h2 className="font-display font-medium text-slate-900 dark:text-white">
                {section.title}
              </h2>
              <ul
                role="list"
                className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200"
              >
                {section.links.map((link, i) => (
                  <li key={link.href} className="relative">
                    <NavLink
                      to={link.href}
                      end={i == 0 ? true : false}
                      prefetch="intent"
                      className={({ isActive }) =>  clsx(
                        'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
                        isActive
                          ? 'font-semibold text-sky-500 before:bg-sky-500'
                          : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
                      )}
                    >
                      {link.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    )
  }