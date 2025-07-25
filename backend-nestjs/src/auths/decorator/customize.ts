import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'IsPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);

export const IS_PUBLIC_OPTIONAL_KEY = 'isPublicOptional';
export const PublicOptional = () => SetMetadata(IS_PUBLIC_OPTIONAL_KEY, true);
