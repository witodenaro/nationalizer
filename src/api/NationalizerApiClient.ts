import axios from 'axios';
import { NationalityResponse } from '../types/nationalities';

class NationalizerApiClient {
  private api =  axios.create({
    baseURL: 'https://api.nationalize.io/',
  });;

  async fetchMany(names: string[]) {
    const query = names.map((name) => `name[]=${name}`).join('&');

    const { data } = await this.api.get<NationalityResponse>('/', {
      params: query,
    });

    return data;
  }
}

export default new NationalizerApiClient();
