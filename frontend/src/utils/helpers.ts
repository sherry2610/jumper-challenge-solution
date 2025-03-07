export function trimAndConcat(str: string): string {
  if (str.length <= 10) return str;

  return `${str.slice(0, 5)}...${str.slice(-5)}`;
}

export const showNumber = (
  num: string | number,
  decimals: number = 6
): string => {
  if (isNaN(Number(num))) {
    throw new Error('Invalid number provided');
  }

  const [integerPart, fractionalPart] = num.toString().split('.');

  if (!fractionalPart || fractionalPart.length <= decimals) {
    return num.toString();
  }

  return `${integerPart}.${fractionalPart.slice(0, decimals)}`;
};
