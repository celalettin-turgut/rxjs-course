import { Observable } from "rxjs";

export const createHttpObservable = (path: string) => {
  return new Observable((observer) => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(path, { signal })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          observer.error(
            "Request failed with the error code" + response.status
          );
        }
      })
      .then((data) => {
        observer.next(data);
        observer.complete();
      })
      .catch((err) => observer.error(err));

    return () => controller.abort();
  });
};
