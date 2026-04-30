import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Toast } from '@/components/toast';
import { api } from '@/services/api';
import { queryClient } from '@/services/query-client';

const originalLinkErrorMessage = 'Informe uma url válida.';
const shortenedLinkErrorMessage =
  'Informe uma url minúscula e sem espaço/caracter especial.';

const newLinkSchema = z.object({
  originalLink: z
    .string()
    .trim()
    .min(1, originalLinkErrorMessage)
    .refine((value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return /^(www\.)[\w-]+\.[a-z]{2,}(\.[a-z]{2,})?(\/[^\s]*)?$/i.test(
          value,
        );
      }
    }, originalLinkErrorMessage),
  shortenedLink: z
    .string()
    .trim()
    .min(1, shortenedLinkErrorMessage)
    .regex(/^[a-z0-9-]+$/, shortenedLinkErrorMessage),
});

type NewLinkData = z.infer<typeof newLinkSchema>;

export const NewLink = () => {
  const [openToastError, setOpenToastError] = useState(false);
  const [errorCreatingNewLink, setErrorCreatingNewLink] = useState({
    title: '',
    description: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewLinkData>({
    resolver: zodResolver(newLinkSchema),
    defaultValues: {
      originalLink: '',
      shortenedLink: '',
    },
  });

  const handleSaveLink = async (data: NewLinkData) => {
    try {
      await api.post('/shortened-links', data);

      queryClient.refetchQueries({ queryKey: ['links list'], exact: true });

      reset();
    } catch {
      setErrorCreatingNewLink({
        title: 'Erro no cadastro',
        description: 'Por favor, tente novamente mais tarde.',
      });

      setOpenToastError(true);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSaveLink)}
        className="max-w-190 w-full md:min-w-145 flex flex-col flex-1 gap-10 md:gap-12 bg-gray-100 rounded-lg p-12 md:p-16"
      >
        <h2 className="text-lg text-gray-600">Novo link</h2>

        <div className="flex flex-col gap-8">
          <Input
            id="input-original-link"
            label="Link Original"
            placeholder="www.exemplo.com.br"
            error={errors.originalLink?.message}
            data-testid="input-original-link"
            {...register('originalLink')}
          />

          <Input
            id="input-shortened-link"
            label="Link Encurtado"
            fixedPlaceholder="brev.ly/"
            error={errors.shortenedLink?.message}
            data-testid="input-shortened-link"
            {...register('shortenedLink')}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          data-testid="button-save-link"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar link'}
        </Button>
      </form>

      <Toast
        id="toast-creation-error"
        type="error"
        title={errorCreatingNewLink.title}
        description={errorCreatingNewLink.description}
        open={openToastError}
        onOpenChange={setOpenToastError}
      />
    </>
  );
};
