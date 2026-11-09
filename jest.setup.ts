import "@testing-library/jest-dom";

// next/jest loads .env files; pin the values the code under test reads so tests are hermetic.
process.env.NEXT_PUBLIC_API_URL = "http://localhost:8081";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";

// Route-handler tests use `@jest-environment node`, which has no window.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  global.ResizeObserver = ResizeObserverMock;
}
