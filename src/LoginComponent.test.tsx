/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-node-access */
import { act, fireEvent, render, screen } from '@testing-library/react';
import LoginComponent from './LoginComponent';
import user from '@testing-library/user-event';

describe('Login component tests', () => {
  const loginServiceMock = {
    login: jest.fn(),
  };
  const setTokenMock = jest.fn();

  let container: HTMLElement;

  function setup() {
    container = render(
      <LoginComponent loginService={loginServiceMock} setToken={setTokenMock} />
    ).container;
  }

  beforeEach(() => {
    setup();
  });

  it('should render correctly the login component', () => {
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(screen.queryByTestId('resultLabel')).not.toBeInTheDocument();
  });

  it('should render correctly - query by test id', () => {
    const inputs = screen.queryAllByTestId('input');
    expect(inputs.length).toBe(3);
    expect(inputs[0].getAttribute('value')).toBe('');
    expect(inputs[1].getAttribute('value')).toBe('');
    expect(inputs[2].getAttribute('value')).toBe('Login');
  });

  it('should render correctly - query by document query', () => {
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBe(3);
    expect(inputs[0].getAttribute('value')).toBe('');
    expect(inputs[1].getAttribute('value')).toBe('');
    expect(inputs[2].getAttribute('value')).toBe('Login');
  });

  it('Click login button with incomplete credentials - show required message', () => {
    const inputs = screen.queryAllByTestId('input');
    const loginButton = inputs[2];
    // loginButton.click();
    fireEvent.click(loginButton);

    act(() => {
      user.click(loginButton);
    });

    const resultLabel = screen.getByTestId('resultLabel');
    expect(resultLabel.textContent).toBe('UserName and password required!');
  });

  it('right credentials = successful login', async () => {
    // it's async and returns a promise => this is the token.
    loginServiceMock.login.mockResolvedValueOnce('1234');
    const inputs = screen.queryAllByTestId('input');
    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    fireEvent.change(userNameInput, { target: { value: 'someUser' } });
    fireEvent.change(passwordInput, { target: { value: 'somePassword' } });
    fireEvent.click(loginButton);

    expect(loginServiceMock.login).toBeCalledWith('someUser', 'somePassword');

    const resultLabel = await screen.findByTestId('resultLabel');
    expect(resultLabel.textContent).toBe('successful login');
  });

  it('right credentials = successful login - with user calls', async () => {
    loginServiceMock.login.mockResolvedValueOnce('1234');
    const inputs = screen.queryAllByTestId('input');
    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    await act(async () => {
      user.click(userNameInput);
      user.keyboard('someUser');

      user.click(passwordInput);
      user.keyboard('somePassword');

      user.click(loginButton);
    });

    // await act(async () => {
    //   user.type(userNameInput, 'someUser');
    //   user.type(passwordInput, 'somePassword');
    //   user.click(loginButton);
    // });

    expect(loginServiceMock.login).toBeCalledWith('someUser', 'somePassword');

    const resultLabel = await screen.findByTestId('resultLabel');
    expect(resultLabel.textContent).toBe('successful login');
  });

  it('right credentials = unsuccessful login', async () => {
    // it's async and returns a promise
    loginServiceMock.login.mockResolvedValueOnce(undefined);
    const inputs = screen.queryAllByTestId('input');
    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    fireEvent.change(userNameInput, { target: { value: 'someUser' } });
    fireEvent.change(passwordInput, { target: { value: 'somePassword' } });
    fireEvent.click(loginButton);

    expect(loginServiceMock.login).toBeCalledWith('someUser', 'somePassword');

    const resultLabel = await screen.findByTestId('resultLabel');
    expect(resultLabel.textContent).toBe('invalid credentials');
  });

  it('right credentials = unsuccessful login - solve act warning', async () => {
    const result = Promise.resolve(undefined);
    loginServiceMock.login.mockResolvedValueOnce(result);
    const inputs = screen.queryAllByTestId('input');
    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    fireEvent.change(userNameInput, { target: { value: 'someUser' } });
    fireEvent.change(passwordInput, { target: { value: 'somePassword' } });
    fireEvent.click(loginButton);

    await result;
    expect(loginServiceMock.login).toBeCalledWith('someUser', 'somePassword');

    const resultLabel = await screen.findByTestId('resultLabel');
    expect(resultLabel.textContent).toBe('invalid credentials');
  });
});
