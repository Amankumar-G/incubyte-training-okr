import { GreetingService } from './greeting-service.ts';
import {describe, it, expect} from 'vitest'


describe('GreetingService', () => {
  it('should return personalised greeting for a user', () => {
    const service = new GreetingService();
    const result = service.greet('user-123');
    expect(result).toBe('Hello, Bhumika!');
  });
});
 