import { eq } from "drizzle-orm";
import { ShortenedLinkNotAvailable } from "@/app/errors/shortened-link-not-available";
import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";

interface DeleteShortenedLinkOutput {
  createdAt: Date;
  id: string;
  originalLink: string;
  quantityAccesses: number;
  shortenedLink: string;
}

export async function deleteShortenedLink(
  shortenedLink: string
): Promise<Either<ShortenedLinkNotAvailable, DeleteShortenedLinkOutput>> {
  const shortenedLinksSchema = schema.shortenedLinks;

  const deletedInfo = await db
    .delete(shortenedLinksSchema)
    .where(eq(shortenedLinksSchema.shortenedLink, shortenedLink))
    .returning();

  if (deletedInfo.length) {
    return makeRight(deletedInfo[0]);
  }

  return makeLeft(new ShortenedLinkNotAvailable());
}
