import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),
  route(":code", "routes/redirect/index.tsx"),
  route("*", "routes/notfound/index.tsx"),
] satisfies RouteConfig;
