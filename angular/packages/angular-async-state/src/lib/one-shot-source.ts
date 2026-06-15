import { EmptyError, firstValueFrom, isObservable, type Observable } from 'rxjs';

export type OneShotSource<TValue> = PromiseLike<TValue> | Observable<TValue>;

export function toOneShotPromise<TValue>(
  source: OneShotSource<TValue>,
  emptyMessage: string,
): Promise<TValue> {
  if (!isObservable(source)) {
    return Promise.resolve(source);
  }

  return firstValueFrom(source).catch((error: unknown) => {
    if (error instanceof EmptyError) {
      throw new Error(emptyMessage);
    }

    throw error;
  });
}
