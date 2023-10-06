import './index.css';
import LoginComponent from './LoginComponent';
import LoginService from './services/LoginService';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const loginService = new LoginService();

const setToken = (token: string) => {
  console.log('Received the token: ' + token);
};

root.render(<LoginComponent loginService={loginService} setToken={setToken} />);
