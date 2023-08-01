import { postAPI } from './';

export const refreshAccessToken = (
  accessToken: string | null,
  refreshToken: string | null,
) => postAPI('/auth/refresh-access-token', { accessToken, refreshToken });

export const loginToServer = async (
  address: string,
  signature: string,
): Promise<{
  signature: string;
  token: string;
}> => {
  const response = await postAPI('/auth/login', {
    address,
    signature,
  });
  return response.data;
};
