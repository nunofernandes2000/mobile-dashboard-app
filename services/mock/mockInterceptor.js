// DEMO_TOKEN só esta aqui para apresentação da universidade
import { handleMockRequest } from './mockApiHandler';

export const DEMO_TOKEN = 'DEMO_SESSION_SIMULATED_TOKEN';

let isInterceptorInstalled = false;

export function setupMockInterceptor() {
  if (isInterceptorInstalled) return;
  isInterceptorInstalled = true;

  const originalFetch = global.fetch;

  global.fetch = async function interceptedFetch(input, init = {}) {
    const headers = init?.headers || {};
    let authHeader = '';

    if (headers instanceof Headers) {
      authHeader = headers.get('Authorization') || headers.get('authorization') || '';
    } else if (typeof headers === 'object') {
      authHeader = headers.Authorization || headers.authorization || '';
    }

    // Interceta apenas se o cabeçalho Authorization contiver o token de demonstração
    if (typeof authHeader === 'string' && authHeader.includes(DEMO_TOKEN)) {
      return handleMockRequest(input, init);
    }

    return originalFetch(input, init);
  };
}
