import React,{useState} from "react";
import { Navigate } from "react-router-dom";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import illustration from "images/signup-illustration.svg";
import logo from "images/logo.svg";
import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import Header from "../components/headers/light";

const Container = tw(ContainerBase)`bg-white text-white font-medium flex justify-center -mr-8 -ml-8 -mb-8 mt-3`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1 border border-primary-900 `;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const SocialButton = styled.a`
  ${tw`w-full max-w-xs font-semibold rounded-lg py-3 border text-primary-900 bg-gray-100 hocus:bg-gray-200 hocus:border-gray-400 flex items-center justify-center transition-all duration-300 focus:outline-none focus:shadow-outline text-sm mt-5 first:mt-0`}
  .iconContainer {
    ${tw`bg-white p-2 rounded-full`}
  }
  .icon {
    ${tw`w-4`}
  }
  .text {
    ${tw`ml-4`}
  }
`;


const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold border border-2 border-primary-900 text-primary-900 w-full py-3 rounded-lg hover:bg-primary-900 hocus:text-gray-200 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
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
  ${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;

const Signup = () =>{
  const logoLinkUrl = "#"
  const illustrationImageSrc = illustration
  const headingText = "Sign Up For NextGen Wealth Banking System"
  const submitButtonText = "Sign Up"
  const SubmitButtonIcon = SignUpIcon
  const tosUrl = "terms"
  const privacyPolicyUrl = "privacy"
  const signInUrl = "#"

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email,setEmail] = useState('');
  const [cp,setCp] = useState('');
  const [sid,setSid] = useState('');
  const [redirect,setRedirect] = useState(false);

  const register = async(e) => {
      e.preventDefault();
      const created_at = new Date();
      console.log("hi",created_at);
      const response = await fetch('http://localhost:4000/register', {
          method: 'POST',
          body: JSON.stringify({username,sid,email,password,cp,created_at}),
          headers: {'Content-Type':'application/json'},
      });
      if (response.status === 200) {
        alert('registration successful');
        setRedirect(true)
      } else if(response.status === 404) {
        alert('User already exists');
      }
      else{
        alert('Sorry, not able to register');
      }
  }
  if(redirect){
      return <Navigate to={'/login'} />
  }

  return (
    
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
              <Form onSubmit={register}>
                <Input type="text" placeholder="User Name" value={username} onChange={e => setUsername(e.target.value)}/>
                <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                <Input type="text" placeholder="SID" value={sid} onChange={e => setSid(e.target.value)}/>
                <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                <Input type="password" placeholder="Confirm Password" value={cp} onChange={e => setCp(e.target.value)}/>
                
                <SubmitButton type="submit">
                  <SubmitButtonIcon className="icon" />
                  <span className="text">Register</span>
                </SubmitButton>
                <p tw="mt-6 text-xs text-gray-600 text-center">
                  I agree to abide by treact's{" "}
                  <a href={tosUrl} tw="border-b border-gray-500 border-dotted">
                    Terms of Service
                  </a>{" "}
                  and its{" "}
                  <a href={privacyPolicyUrl} tw="border-b border-gray-500 border-dotted">
                    Privacy Policy
                  </a>
                </p>

                <p tw="mt-8 text-sm text-gray-600 text-center">
                  Already have an account?{" "}
                  <a href="login" tw="border-b border-gray-500 border-dotted">
                    Sign In
                  </a>
                </p>
              </Form>
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

export default Signup;
 
