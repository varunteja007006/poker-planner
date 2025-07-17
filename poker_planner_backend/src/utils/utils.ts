export const extractToken = (token: string) => {

  if (token.startsWith('Bearer ')) {
    return token.split(' ')[1];
  }

  return token;
};
