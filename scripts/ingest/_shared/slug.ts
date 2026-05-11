// Slug helper. Matches the resources.slug check constraint:
//   ^[a-z0-9][a-z0-9-]*[a-z0-9]$ (length 1..80)

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const trimmed = base.slice(0, 80).replace(/-+$/, '');
  return trimmed || 'untitled';
}
