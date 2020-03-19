import React, { FC, useReducer, ChangeEvent } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import { Button, Input } from 'Components';
import male from 'assets/login_male.gif';
import female from 'assets/login_female.gif';

const LoginView = styled.div`
  font-size: 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 4rem;
`;

const Female = styled.img`
  position: absolute;
  bottom: 0;
  right: 25%;
  height: 80%;
  width: 30%;
  object-fit: cover;
`;

const Male = styled.img`
  position: absolute;
  bottom: 0;
  right: 2rem;
  height: 90%;
  width: 30%;
  object-fit: cover;
`;

const LoginForm = styled.form`
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  width: 50%;
`;

const ModuWorld = styled.img`
  width: 100%;
`;

const Email = styled(Input)`
  width: 50%;
  margin-top: 4rem;
`;

const Password = styled(Input)`
  width: 50%;
  margin-top: 2rem;
`;

const Submit = styled(Button)`
  margin-top: 2rem;
`;

interface Props extends RouteComponentProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login: FC<Props> = ({ history, setIsAuthenticated }) => {
  const [loginInput, setLoginInput] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {
    email: '',
    password: '',
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInput({ [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { email, password } = loginInput;
    try {
      await Auth.signIn(email, password);
      setIsAuthenticated(true);
      history.push('/posts');
    } catch (e) {}
  };

  return (
    <LoginView onSubmit={handleSubmit}>
      <Male src={male} />
      <Female src={female} />

      <LoginForm>
        <ModuWorld src={require('assets/modu_world.png')} />
        <Email type="text" placeholder="EMAIL" name="email" onChange={handleInput} value={loginInput.email} />
        <Password
          type="password"
          placeholder="PASSWORD"
          name="password"
          onChange={handleInput}
          value={loginInput.password}
        />
        <Submit type="submit" color="white">
          LOGIN
        </Submit>
      </LoginForm>
    </LoginView>
  );
};

export { Login };
