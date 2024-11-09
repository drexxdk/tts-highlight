import axios, { AxiosError } from 'axios';

/** Used for sending POST requests
 * @param baseURL The url for the specific API you want to send the request to
 * @param url The appended url for the specific REST controller you want to send the request to
 * @param body the data to attach to the POST request in the form of the ContentType
 * @param params can be used for attaching parameters to the request
 * @returns The response from the POST request */
export const postRequest = async <T>(baseURL: string, url: string, body: object, params?: unknown) => {
  return await axios
    .post<T>(url, body, {
      baseURL,
      params,
    })
    .then((x) => x.data)
    .catch((error: AxiosError) => handleError(error));
};

/** Method to handle a generic way to handle all errors coming from requests to the APIs */
export const handleError = (error: AxiosError) => {
  console.log(error);
};
