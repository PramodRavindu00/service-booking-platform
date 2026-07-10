import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_ROUTE = Reflector.createDecorator<boolean>();

//wrapping the decorator to use the value as true everyTime
export const PublicRoute = () => IS_PUBLIC_ROUTE(true);
