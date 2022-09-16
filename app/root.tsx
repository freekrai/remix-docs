import type { HeadersFunction, LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  useLoaderData,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch
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

import config from '~/docs.config';

import { getSeo } from "~/seo";
let [seoMeta, seoLinks] = getSeo();

import tailwindStyles from "./styles/app.css"

//import type {SideBarItem, SidebarGroup} from '~/utils/docs.server';
import Container from "~/components/layout/Container";

export const handle = {
  id: 'root',
}

export type LoaderData = {
  theme: Theme | null;
};

export const meta: MetaFunction = () => ({
  ...seoMeta,
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  ...seoLinks,
  { rel: "preconnect", href: "//fonts.gstatic.com", crossOrigin: "anonymous" },
  {rel: "stylesheet", href: tailwindStyles},
  { rel: "stylesheet", href: "//fonts.googleapis.com/css?family=Work+Sans:300,400,600,700&amp;lang=en" },
]

export const headers: HeadersFunction = () => {
  return { "Cache-Control": new CacheControl("swr").toString() };
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
    return json({
      theme: themeSession.getTheme(),
    });
};

function App() {
  const data = useLoaderData<LoaderData>();
  const [theme] = useTheme();
  return (
    <html lang="en" className={theme ?? ""}>
      <head>
        <Meta />
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

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorDocument title="Error!">
      <ErrorPage 
        code={500}
        title={`There was an error`} 
        message={error.message} 
      />
    </ErrorDocument>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }
  return (
    <ErrorDocument title={`${caught.status} ${caught.statusText}`}>
      <ErrorPage code={caught.status} title={`${caught.status}: ${caught.statusText}`} message={message} />
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