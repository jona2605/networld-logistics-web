import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const cleanRouteEntries = [
  ["/servicios", "/servicios/index.html"],
  ["/servicios/", "/servicios/index.html"],
  ["/nosotros", "/nosotros/index.html"],
  ["/nosotros/", "/nosotros/index.html"],
  ["/contacto", "/contacto/index.html"],
  ["/contacto/", "/contacto/index.html"],
  ["/academia", "/academia/index.html"],
  ["/academia/", "/academia/index.html"],
  ["/tramites-aduanales-el-salvador", "/tramites-aduanales-el-salvador/index.html"],
  ["/tramites-aduanales-el-salvador/", "/tramites-aduanales-el-salvador/index.html"],
  ["/transporte-maritimo-el-salvador", "/transporte-maritimo-el-salvador/index.html"],
  ["/transporte-maritimo-el-salvador/", "/transporte-maritimo-el-salvador/index.html"],
  ["/carga-desde-china-a-el-salvador", "/carga-desde-china-a-el-salvador/index.html"],
  ["/carga-desde-china-a-el-salvador/", "/carga-desde-china-a-el-salvador/index.html"],
  ["/carga-desde-estados-unidos-a-el-salvador", "/carga-desde-estados-unidos-a-el-salvador/index.html"],
  ["/carga-desde-estados-unidos-a-el-salvador/", "/carga-desde-estados-unidos-a-el-salvador/index.html"],
  ["/transporte-aereo-el-salvador", "/transporte-aereo-el-salvador/index.html"],
  ["/transporte-aereo-el-salvador/", "/transporte-aereo-el-salvador/index.html"],
  ["/transporte-terrestre-centroamerica", "/transporte-terrestre-centroamerica/index.html"],
  ["/transporte-terrestre-centroamerica/", "/transporte-terrestre-centroamerica/index.html"],
  ["/logistica-para-pymes-el-salvador", "/logistica-para-pymes-el-salvador/index.html"],
  ["/logistica-para-pymes-el-salvador/", "/logistica-para-pymes-el-salvador/index.html"],
];

const protectedRoutes = new Set(["/recursos", "/recursos/", "/herramientas", "/herramientas/", "/casos", "/casos/"]);

function rewriteCleanRoutes(req, res, next) {
  const [pathname, query = ""] = req.url.split("?");

  if (pathname === "/portal" || pathname === "/portal/") {
    res.writeHead(302, { Location: "https://logicstrack-app.web.app" });
    res.end();
    return;
  }

  if (protectedRoutes.has(pathname)) {
    res.writeHead(302, { Location: "/contacto/" });
    res.end();
    return;
  }

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
        contacto: resolve(projectRoot, "contacto/index.html"),
        academia: resolve(projectRoot, "academia/index.html"),
        tramitesAduanales: resolve(projectRoot, "tramites-aduanales-el-salvador/index.html"),
        transporteMaritimo: resolve(projectRoot, "transporte-maritimo-el-salvador/index.html"),
        cargaDesdeChina: resolve(projectRoot, "carga-desde-china-a-el-salvador/index.html"),
        cargaDesdeEstadosUnidos: resolve(projectRoot, "carga-desde-estados-unidos-a-el-salvador/index.html"),
        transporteAereo: resolve(projectRoot, "transporte-aereo-el-salvador/index.html"),
        transporteTerrestre: resolve(projectRoot, "transporte-terrestre-centroamerica/index.html"),
        logisticaPymes: resolve(projectRoot, "logistica-para-pymes-el-salvador/index.html"),
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
