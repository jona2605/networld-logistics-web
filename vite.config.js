import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const cleanRouteEntries = [
  ["/servicios", "/servicios/index.html"],
  ["/servicios/", "/servicios/index.html"],
  ["/recursos", "/recursos/index.html"],
  ["/recursos/", "/recursos/index.html"],
  ["/nosotros", "/nosotros/index.html"],
  ["/nosotros/", "/nosotros/index.html"],
  ["/portal", "/portal/index.html"],
  ["/portal/", "/portal/index.html"],
  ["/contacto", "/contacto/index.html"],
  ["/contacto/", "/contacto/index.html"],
  ["/academia", "/academia/index.html"],
  ["/academia/", "/academia/index.html"],
  ["/herramientas", "/herramientas/index.html"],
  ["/herramientas/", "/herramientas/index.html"],
  ["/casos", "/casos/index.html"],
  ["/casos/", "/casos/index.html"],
];

function rewriteCleanRoutes(req, res, next) {
  const [pathname, query = ""] = req.url.split("?");
  const target = cleanRouteEntries.find(([route]) => route === pathname);

  if (target) {
    req.url = `${target[1]}${query ? `?${query}` : ""}`;
  }

  next();
}

export default {
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(projectRoot, "index.html"),
        servicios: resolve(projectRoot, "servicios/index.html"),
        nosotros: resolve(projectRoot, "nosotros/index.html"),
        recursos: resolve(projectRoot, "recursos/index.html"),
        academia: resolve(projectRoot, "academia/index.html"),
        herramientas: resolve(projectRoot, "herramientas/index.html"),
        casos: resolve(projectRoot, "casos/index.html"),
        portal: resolve(projectRoot, "portal/index.html"),
        contacto: resolve(projectRoot, "contacto/index.html"),
      },
    },
  },
  plugins: [
    {
      name: "networld-clean-routes",
      configureServer(server) {
        server.middlewares.use(rewriteCleanRoutes);
      },
      configurePreviewServer(server) {
        server.middlewares.use(rewriteCleanRoutes);
      },
    },
  ],
};
