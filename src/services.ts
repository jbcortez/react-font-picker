import { GET_GFONTS_LIST } from './constants';

export const getGoogleFontsList = (api: string) => {
  return fetch(GET_GFONTS_LIST + `&key=${api}`)
    .then((res) => res.json())
    .then((res) => {
      return res.items;
    })
    .catch((err) => {
      console.log(err);
    });
};
