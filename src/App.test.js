import React from 'react';
import { render, screen, fireEvent, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer';

import App from './App';

jest.setTimeout(15000);

test('1) Button', () => {
  const { getByText } = render(<App />);
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
});
test('2) Repository search bar', () => {
  const { getByText } = render(<App />);
  const repo_search_bar = screen.getByPlaceholderText('Search repository')
  expect(repo_search_bar).toBeInTheDocument();
});
test('3) Username search bar', () => {
  const { getByText } = render(<App />);
  const username_search_bar = screen.getByPlaceholderText('Search username')
  expect(username_search_bar).toBeInTheDocument();
});
test('4) Username search bar get the name of the user', async () => {
  var { getByText } = render(<App />);

  fireEvent.change(screen.getByPlaceholderText('Search username'), { target: { value: 'ntzi' } })
  userEvent.click(getByText('Search'))
  await waitForElement(() => getByText('Nikos Tziralis'));
});
test('5) Repository search bar, search as type', async () => {
  var { getByText } = render(<App />);
  fireEvent.change(screen.getByPlaceholderText('Search username'), { target: { value: 'ntzi' } })
  userEvent.click(getByText('Search'))
  await waitForElement(() => getByText('Nikos Tziralis'));

  fireEvent.change(screen.getByPlaceholderText('Search repository'), { target: { value: 'cha' } })
  let chatbot = getByText('chatbot');
  let cryptopals_challenges = screen.queryByText('cryptopals_challenges');

  expect(chatbot).toBeInTheDocument();
  expect(cryptopals_challenges).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText('Search repository'), { target: { value: 'chat' } })
  expect(chatbot).toBeInTheDocument();
  expect(cryptopals_challenges).not.toBeInTheDocument();
});
test('6) Username not exist', async () => {
  var { getByText } = render(<App />);
  fireEvent.change(screen.getByPlaceholderText('Search username'), { target: { value: '' } })
  userEvent.click(getByText('Search'))
  await waitForElement(() => getByText("Username: '' is not found."));
});
