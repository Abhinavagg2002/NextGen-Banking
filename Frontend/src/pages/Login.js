import React,{useState,useContext} from "react";
import { Navigate } from "react-router-dom";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import {css} from "styled-components/macro"; //eslint-disable-line
import illustration from "images/login-illustration.svg";
import logo from "images/logo.svg";
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import Header from "../components/headers/light";
import { UserContext } from "../UserContext";

const Container = tw(ContainerBase)` bg-white text-white font-medium flex justify-center -mr-8 -ml-8 -mb-8 mt-3`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1 border border-primary-900 `;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;



const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-primary-900 border border-2 border-primary-900 w-full py-4 rounded-lg hover:bg-primary-900 hocus:text-gray-200 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-sm bg-contain bg-center bg-no-repeat`}
`;

const Login = () =>{

  const logoLinkUrl = "#"
  const illustrationImageSrc = illustration
  const headingText = "Sign In To NextGen Wealth Banking System"
  const SubmitButtonIcon = LoginIcon
  const forgotPasswordUrl = "#"
  
  const [sid,setSid] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);

    const login = async(e) => {
      e.preventDefault();
      const response = await fetch('http://localhost:4000/login', {
          method: 'POST',
          body: JSON.stringify({sid, password}),
          headers: {'Content-Type':'application/json'},
          credentials: 'include',
      });
      if (response.ok) {
          response.json().then(userInfo => {
             sessionStorage.setItem('myData', JSON.stringify(userInfo))
              setUserInfo(userInfo);
              setRedirect(true);
          });
      }else {
        try {
          const errorData = await response.json();
          alert(errorData.error);
        } catch (error) {
          console.error('Error parsing response JSON', error);
          alert('An error occurred, please try again.');
        }
      }
  }
  if (redirect) {
      return <Navigate to={'/dashboard'} />
  }

  return(
    <AnimationRevealPage>
    <Header/>
    <Container>
      <Content>
        <MainContainer>
          <LogoLink href={logoLinkUrl}>
            <LogoImage src={logo} />
          </LogoLink>
          <MainContent>
            <Heading>{headingText}</Heading>
            <FormContainer>
              <Form onSubmit={login}>  
                <Input type="text" placeholder="SID" value={sid} onChange={e => setSid(e.target.value)}/>
                <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <SubmitButton type="submit">
                  <SubmitButtonIcon className="icon" />
                  <span className="text">Log In</span>
                </SubmitButton>
              </Form>
              <p tw="mt-6 text-xs text-gray-600 text-center">
                <a href={forgotPasswordUrl} tw="border-b border-gray-500 border-dotted">
                  Forgot Password ?
                </a>
              </p>
              <p tw="mt-8 text-sm text-gray-600 text-center">
                Dont have an account?{" "}
                <a href= "/signup" tw="border-b border-gray-500 border-dotted">
                  Sign Up
                </a>
              </p>
            </FormContainer>
          </MainContent>
        </MainContainer>
        <IllustrationContainer>
          <IllustrationImage imageSrc={illustrationImageSrc} />
        </IllustrationContainer>
      </Content>
    </Container>
  </AnimationRevealPage>
  )
}
export default Login
