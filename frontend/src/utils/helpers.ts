export function trimAndConcat(str: string): string {
  if (str.length <= 10) return str;

  return `${str.slice(0, 5)}...${str.slice(-5)}`;
}

export const numFormatter = (value: string | number): string => {
  const num = Number(value);

  if (num > 0 && num < 0.0001) {
    return '<0.0001';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
  });

  return formatter.format(num);
};
