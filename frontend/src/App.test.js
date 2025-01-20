import { render, screen } from '@testing-library/react';
import App from 'C:/Users/Omesh/OneDrive/Documents/GitHub/WBD_eventweb/frontend/src/App';

test('renders learn react link', () => {
  render(<App/>);
const welcomeText = screen.getByText(/Welcome to Event Web/i);
expect(welcomeText).toBeInTheDocument();

});