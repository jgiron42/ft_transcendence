export type requestBinaryPredicate = <T>(req: Request<T>) => boolean | Promise<boolean>;
