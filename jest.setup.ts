import "@testing-library/jest-dom";
class MockIO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as unknown as { IntersectionObserver: typeof MockIO }).IntersectionObserver = MockIO;