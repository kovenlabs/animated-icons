import "@testing-library/jest-dom/vitest"

// jsdom has no IntersectionObserver; useInView only needs it to exist.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.IntersectionObserver ??= IntersectionObserverStub as unknown as typeof IntersectionObserver
