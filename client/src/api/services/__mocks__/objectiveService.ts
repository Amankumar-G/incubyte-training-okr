import { vi } from 'vitest';

export default {
  getAllOkrs: vi.fn(() => Promise.resolve({ data: [] })),
  deleteOkr: vi.fn(),
};
