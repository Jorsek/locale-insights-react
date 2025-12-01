import { http, HttpResponse } from 'msw';
import { config } from '../../src/config';

const mockLocales = [
  { code: 'en', displayName: 'English' },
  { code: 'es', displayName: 'Spanish' },
  { code: 'fr', displayName: 'French' },
  { code: 'de', displayName: 'German' },
  { code: 'ja', displayName: 'Japanese' },
  { code: 'zh', displayName: 'Chinese' },
];

export const handlers = [
  http.get(`${config.apiBaseUrl}/active-locales`, () => {
    return HttpResponse.json(mockLocales);
  }),
];
