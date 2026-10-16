import { isAxiosError } from "axios";

const DEFAULT_MESSAGE = 'Something went wrong.';

const getErrorMessages = (errors: unknown[]): string[] =>
  errors.flatMap((e) => {
    if (e === null || e === undefined) return [];   // No error.

    if (isAxiosError(e)) {
      const data = e.response?.data;

      if (typeof data?.error === 'string') return [data.error];

      if (data?.error && typeof data.error === 'object') {
        return Object.values(data.error).map(String);
      }

      if (typeof data?.message === 'string') return [data.message];
    }

    return [DEFAULT_MESSAGE];
  });

export default getErrorMessages;