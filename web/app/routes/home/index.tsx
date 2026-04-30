import { MyLinks } from "./components/my-links";
import { NewLink } from "./components/new-link";
import type { Route } from "./+types/index";
import logo from "@/assets/logo.svg";

export function loader() {
  return null;
}

const homeTitle = "Brev.ly — Encurtador de links";
const homeDescription =
  "Encurte URLs, copie com um clique e acompanhe seus links na lista. Rápido e simples.";

export const meta: Route.MetaFunction = () => [
  { title: homeTitle },
  { name: "description", content: homeDescription },
  { property: "og:title", content: homeTitle },
  { property: "og:description", content: homeDescription },
  { property: "og:type", content: "website" },
];

export default function Home() {
    return (
      <main
        className="min-h-screen flex flex-col items-center py-16 px-6 bg-gray-200"
        data-testid="container-home-page"
      >
        <div className="w-full md:max-w-490 md:w-[calc(100vw - 1.5rem)] md:mt-25 flex flex-col items-center md:items-start gap-16">
          <img
            src={logo}
            alt="Ícone de corrente azul representando um link ao lado do nome 'brev.ly' também em azul."
            className="h-12"
          />

          <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-10">
            <NewLink />

            <MyLinks />
          </div>
        </div>
    </main>
  );
}