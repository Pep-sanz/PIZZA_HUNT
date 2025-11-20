export const collapseText = (value: string, limit = 30): string => {
  if (!value) return '';
  if (value.length <= limit) return value;
  return `${value.slice(0, limit).trimEnd()}...`;
};
