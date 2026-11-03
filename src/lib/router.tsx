import { createContext, useContext, useEffect, useMemo, useState, type AnchorHTMLAttributes, type ReactNode } from "react";

type RouterValue = { path: string; search: URLSearchParams; navigate: (to: string) => void };
const RouterContext = createContext<RouterValue | null>(null);

function readRoute() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [pathPart, query = ""] = raw.split("?");
  return { path: pathPart.startsWith("/") ? pathPart : `/${pathPart}`, search: new URLSearchParams(query) };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const value = useMemo<RouterValue>(() => ({
    ...route,
    navigate: (to: string) => {
      if (readRoute().path + (readRoute().search.toString() ? `?${readRoute().search}` : "") === to) {
        setRoute(readRoute());
      } else {
        window.location.hash = to;
      }
    },
  }), [route]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const value = useContext(RouterContext);
  if (!value) throw new Error("useRouter must be used inside RouterProvider");
  return value;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };
export function Link({ to, children, ...props }: LinkProps) {
  return <a href={`#${to}`} {...props}>{children}</a>;
}
