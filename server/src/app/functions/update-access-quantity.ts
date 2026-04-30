import { eq, sql } from "drizzle-orm";
import { ShortenedLinkNotAvailable } from "@/app/errors/shortened-link-not-available";
import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";

interface UpdateAccessQuantityOutput {
  originalLink: string;
  quantityAccesses: number;
  shortenedLink: string;
}

export async function updateAccessQuantity(
  shortenedLink: string
): Promise<Either<ShortenedLinkNotAvailable, UpdateAccessQuantityOutput>> {
  const shortenedLinksSchema = schema.shortenedLinks;

  const [shortenedLinkInfo] = await db
    .update(shortenedLinksSchema)
    .set({
      quantityAccesses: sql`${shortenedLinksSchema.quantityAccesses} + 1`,
    })
    .where(eq(shortenedLinksSchema.shortenedLink, shortenedLink))
    .returning({
      originalLink: shortenedLinksSchema.originalLink,
      shortenedLink: shortenedLinksSchema.shortenedLink,
      quantityAccesses: shortenedLinksSchema.quantityAccesses,
    });

  if (!shortenedLinkInfo) {
    return makeLeft(new ShortenedLinkNotAvailable());
  }

  return makeRight(shortenedLinkInfo);
}
