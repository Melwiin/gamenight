// Generated by React Router

import "react-router"

declare module "react-router" {
  interface Register {
    pages: Pages
    routeFiles: RouteFiles
  }
}

type Pages = {
  "/": {
    params: {};
  };
  "/login": {
    params: {};
  };
  "/lobby": {
    params: {};
  };
  "/.well-known/appspecific/com.chrome.devtools.json": {
    params: {};
  };
};

type RouteFiles = {
  "root.tsx": {
    id: "root";
    page: "/" | "/login" | "/lobby" | "/.well-known/appspecific/com.chrome.devtools.json";
  };
  "routes/home.tsx": {
    id: "routes/home";
    page: "/";
  };
  "routes/login.tsx": {
    id: "routes/login";
    page: "/login";
  };
  "routes/lobby.tsx": {
    id: "routes/lobby";
    page: "/lobby";
  };
  "routes/debug-null.tsx": {
    id: "routes/debug-null";
    page: "/.well-known/appspecific/com.chrome.devtools.json";
  };
};