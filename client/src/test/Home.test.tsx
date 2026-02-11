import { render, screen } from '@testing-library/react';
import Home from '../Home.tsx';
import { vi, test, expect, describe } from 'vitest';

vi.mock('../api/services/objectiveService');
vi.mock('../api/services/keyResultService');

describe('Home Page – static content', () => {
  test('renders static header content', async () => {
    render(<Home />);

    expect(screen.getByText('Objective & Key Results Tracker')).toBeInTheDocument();

    expect(screen.getByText('Track and achieve your objectives')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: '+ New OKR' })).toBeInTheDocument();
  });
});
