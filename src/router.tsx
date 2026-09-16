import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface RouteMatch {
  path: string;
  route: string;
  params: Record<string, string>;
}

interface RouterContextType {
  path: string;
  navigate: (to: string, options?: { replace?: boolean; state?: any }) => void;
  params: Record<string, string>;
  activeTab: string;
}

const RouterContext = createContext<RouterContextType>({
  path: "/",
  navigate: () => {},
  params: {},
  activeTab: "courses",
});

// Helper to extract clean path from window.location
export function getCleanPath(): string {
  if (typeof window === "undefined") return "/";
  const path = window.location.pathname;
  return path === "" ? "/" : path;
}

// Derive navigation active tab key from URL path
export function pathToActiveTab(path: string): string {
  
  if (path === "/" || path.startsWith("/courses")) return "courses";
  if (path.startsWith("/bootcamps")) return "bootcamps";
  if (path.startsWith("/video-lessons") || path.startsWith("/lessons")) return "lessons";
  if (path.startsWith("/instructor") || path.startsWith("/umair")) return "instructor";
  if (path.startsWith("/blogs") || path.startsWith("/deep-dives")) return "blogs";
  if (path.startsWith("/access-status") || path.startsWith("/check-access")) return "access-status";
  if (path.startsWith("/login")) return "login";
  if (path.startsWith("/register")) return "register";
  if (path.startsWith("/admin") || path.startsWith("/instructor-portal")) return "admin";
  return "courses";
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(getCleanPath());
  const [params, setParams] = useState<Record<string, string>>({});

  const updateRoute = useCallback((newPath: string) => {
    setPath(newPath);
    
    // Parse route params for /courses/:id, /bootcamps/:id, /blogs/:id
    const p: Record<string, string> = {};
    const courseMatch = newPath.match(/^\/courses\/([^/?#]+)/);
    if (courseMatch) p.courseId = courseMatch[1];

    const bootcampMatch = newPath.match(/^\/bootcamps\/([^/?#]+)/);
    if (bootcampMatch) p.bootcampId = bootcampMatch[1];

    const blogMatch = newPath.match(/^\/blogs\/([^/?#]+)/);
    if (blogMatch) p.blogId = blogMatch[1];

    setParams(p);
  }, []);

  useEffect(() => {
    updateRoute(getCleanPath());

    const handlePopState = () => {
      updateRoute(getCleanPath());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [updateRoute]);

  const navigate = useCallback((to: string, options?: { replace?: boolean; state?: any }) => {
    if (typeof window === "undefined") return;

    // Normalizing URL path
    const targetPath = to.startsWith("/") ? to : `/${to}`;

    if (options?.replace) {
      window.history.replaceState(options?.state || null, "", targetPath);
    } else {
      window.history.pushState(options?.state || null, "", targetPath);
    }

    updateRoute(targetPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateRoute]);

  const activeTab = pathToActiveTab(path);

  return (
    <RouterContext.Provider value={{ path, navigate, params, activeTab }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  return useContext(RouterContext);
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ href, children, className, replace = false, onClick, ...rest }) => {
  const { navigate, path } = useRouter();
  const isActive = path === href || (href !== "/" && path.startsWith(href));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    // Let browser handle command-click, control-click or external URLs
    if (e.metaKey || e.ctrlKey || e.shiftKey || href.startsWith("http") || href.startsWith("//") || href.startsWith("mailto:")) {
      return;
    }
    e.preventDefault();
    navigate(href, { replace });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      data-active={isActive ? "true" : "false"}
      {...rest}
    >
      {children}
    </a>
  );
};
