import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router';
import type { Route } from './+types/index';
import logoIcon from '@/assets/logo-icon.svg';
import { ApiError, api } from '@/services/api';
import { queryClient } from '@/services/query-client';
import { refetchChannel } from '@/services/broadcast-channel';

type GetOriginalLinkOutput = {
  originalLink: string;
};

export function loader() {
  return null;
}

const redirectTitle = 'Redirecionando… | Brev.ly';
const redirectDescription =
  'Você está sendo redirecionado para o destino do link encurtado.';

export const meta: Route.MetaFunction = () => [
  { title: redirectTitle },
  { name: 'description', content: redirectDescription },
  { property: 'og:title', content: redirectTitle },
  { property: 'og:description', content: redirectDescription },
];

export default function Redirect() {
  const [rendered, setRendered] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const slug = pathname.slice(1);

    const getOriginalLink = async (): Promise<void> => {
      try {
        const data = await api.get<GetOriginalLinkOutput>(
          `/shortened-links/${slug}/original-link`,
        );

        let url = data.originalLink;

        if (url.startsWith('www.')) {
          url = `https://${url}`;
        }

        window.location.href = url;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          navigate('/url/not-found');
        }
      }
    };

    const updateAccessQuantity = async (): Promise<void> => {
      try {
        await api.patch(`/shortened-links/${slug}/access`);

        queryClient.refetchQueries({ queryKey: ['links list'], exact: true });

        refetchChannel.postMessage({ queryKey: ['links list'], exact: true });
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          navigate('/url/not-found');
        }
      }
    };

    if (pathname && rendered) {
      getOriginalLink();
      updateAccessQuantity();
    } else {
      setRendered(true);
    }
  }, [pathname, navigate, rendered]);

  return (
    <main
      className="w-screen min-h-screen flex flex-row items-center justify-center p-6 bg-gray-200"
      data-testid="container-redirect-page"
    >
      <div className="max-w-290 w-full h-fit flex flex-col gap-12 items-center text-center bg-gray-100 rounded-lg px-10 py-24 md:px-24 md:py-32">
        <img
          src={logoIcon}
          alt="Logotipo do site com um ícone de corrente azul que representa um link."
          className="h-24"
        />

        <h1 className="text-xl text-gray-600">Redirecionando...</h1>

        <div className="flex flex-col gap-2">
          <p className="text-md text-gray-500">
            O link será aberto automaticamente em alguns instantes.
          </p>

          <p className="text-md text-gray-500">
            Não foi redirecionado?{' '}
            <a
              href="/"
              className="text-blue-base underline"
              data-testid="link-access-here"
            >
              Acesse aqui
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}