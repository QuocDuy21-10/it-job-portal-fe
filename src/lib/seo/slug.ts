const MAX_SLUG_LENGTH = 80;
// A Mongo ObjectId at the end, alone or after a hyphen.
const TRAILING_ID = /(?:^|-)([0-9a-f]{24})$/;

export const slugify = (text: string) => {
  const slug = text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length <= MAX_SLUG_LENGTH) {
    return slug;
  }

  const cut = slug.slice(0, MAX_SLUG_LENGTH + 1);
  const boundary = cut.lastIndexOf("-");

  return boundary > 0 ? cut.slice(0, boundary) : slug.slice(0, MAX_SLUG_LENGTH);
};

export const toSlugId = (name: string, id: string) => {
  const slug = slugify(name);

  return slug ? `${slug}-${id}` : id;
};

export const parseSlugId = (value: string) =>
  value.match(TRAILING_ID)?.[1] ?? null;

export const isCanonicalSlugId = (value: string, name: string, id: string) =>
  value === toSlugId(name, id);
