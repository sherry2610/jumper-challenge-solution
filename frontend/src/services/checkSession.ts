import axios, { AxiosError } from 'axios';

export const checkSession = async (
  address: string
): Promise<{
  valid: boolean;
  address?: string;
  message?: string;
}> => {
  try {
    const response = await axios.get(
      `/api/account/session?address=${address}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: AxiosError | unknown) {
    if (axios.isAxiosError(error)) {
      return { valid: false, message: error.response?.data };
    } else {
      return { valid: false, message: 'Unknown Error' };
    }
  }
};
