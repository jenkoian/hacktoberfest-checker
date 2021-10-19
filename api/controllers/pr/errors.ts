const statusCodes: {
  [key: string]: number;
} = {
  notUser: 400,
};

const errorDescriptions: {
  [key: string]: string;
} = {
  notUser: 'Username must belong to a user account.',
};

export const getStatusCode = (error: string) => statusCodes[error] || 400;

export const getErrorDescription = (error: string) =>
  errorDescriptions[error] ||
  "Couldn't find any data or we hit an error, err try again?";
