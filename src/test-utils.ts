export function createMockHttpService() {
  return {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    getRedirectUrl: jest.fn(),
    ping: jest.fn(),
  };
}

export type MockHttpService = ReturnType<typeof createMockHttpService>;
