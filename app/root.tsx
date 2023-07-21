import type { HeadersFunction, LinksFunction, LoaderFunction, V2_MetaFunction } from "@vercel/remix";
import { json } from "@vercel/remix";
import {
  Links,
  useLoaderData,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import {
  ThemeBody,
  ThemeHead,
  ThemeProvider,
  useTheme,
} from "~/utils/theme-provider";
import type { Theme } from "~/utils/theme-provider";
import { getThemeSession } from "~/utils/theme.server";

import { CacheControl } from "~/utils/cache-control.server";
import ErrorPage from '~/components/ErrorPage'

import tailwindStyles from "./tailwind.css"

//import type {SideBarItem, SidebarGroup} from '~/utils/docs.server';
import Container from "~/components/layout/Container";

import {getDomainUrl, removeTrailingSlash} from '~/utils'

import config from '~/docs.config';
import { getSeo}  from '~/seo'

export const meta: V2_MetaFunction = ({ data, matches }) => {
  if(!data) return [];

  return [
    getSeo({
      title: config.title,
      description: config.description,
      url: data.canonical ? data.canonical : '',
    }),  
  ]
}

export const handle = {
  id: 'root',
}

export type LoaderData = {
  theme: Theme | null;
  canonical?: string;
  requestInfo: {
    url: string;
    origin: string
    path: string
  } | null;
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "//fonts.gstatic.com", crossOrigin: "anonymous" },
  {rel: "stylesheet", href: tailwindStyles},
  { rel: "stylesheet", href: "//fonts.googleapis.com/css?family=Work+Sans:300,400,600,700&amp;lang=en" },
]

export const headers: HeadersFunction = () => {
  return { "Cache-Control": new CacheControl("swr").toString() };
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);

  const url = getDomainUrl(request);
  const path = new URL(request.url).pathname;

  return json({
    theme: themeSession.getTheme(),
    canonical: removeTrailingSlash(`${url}${path}`),
    requestInfo: {
      url: removeTrailingSlash(`${url}${path}`),
      origin: getDomainUrl(request),
      path: new URL(request.url).pathname,
    },
  });
};

function App() {
  const data = useLoaderData<LoaderData>();
  const [theme] = useTheme();
  return (
    <html lang="en" className={theme ?? ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        {data.requestInfo && <link
          rel="canonical"
          href={removeTrailingSlash(
            `${data.requestInfo.origin}${data.requestInfo.path}`,
          )}
        />}
        <Links />
        <ThemeHead ssrTheme={Boolean(data.theme)} />
      </head>
      <body>
        <Container>
          <Outlet />
        </Container>
        <ThemeBody ssrTheme={Boolean(data.theme)} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();
  let status = '500';
  let message = '';
  let stacktrace;

  // when true, this is what used to go to `CatchBoundary`
  if ( error.status === 404 ) {
    status = 404;
    message = 'Page Not Found';
  } else if (error instanceof Error) {
    status = '500';
    message = error.message;
    stacktrace = error.stack;
  } else {
    status = '500';
    message = 'Unknown Error';
  }
  return (
    <ErrorDocument title="Error!">
      <ErrorPage
        code={status}
        title={`There was an error`}
        message={message}
      />
    </ErrorDocument>
  );
}

function ErrorDocument({
  children,
  title
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html className="h-full" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
