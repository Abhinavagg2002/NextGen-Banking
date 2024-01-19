import React,{useState} from "react";
import {Navigate} from "react-router-dom"
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import EmailIllustrationSrc from "images/email-illustration.svg";



const Container = tw.div` bg-white text-white font-medium flex justify-center -mr-8 -ml-8 -mb-8 mt-3`;
const TwoColumn = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1 border border-primary-900 px-5 py-4`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)(props => [
  tw`md:w-7/12 mt-16 md:mt-0`,  
  props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);

const Image = styled.div(props => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(SectionHeading)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`

const Form = tw.form`mt-8 md:mt-10 text-sm flex flex-col max-w-sm mx-auto md:mx-0`
const Input = tw.input`mt-6 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`
const Textarea = styled(Input).attrs({as: "textarea"})`
  ${tw`h-24`}
`

const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8`

const FormBankLoan = () =>{
  const subheading = "Money Loan Form";
  const heading = <>Enter your details</>;
  const submitButtonText = "Send";
  const formAction = "#";
  const formMethod = "get";
  const textOnLeft = true;

  const storedData = sessionStorage.getItem('myData');
  const parsedData = JSON.parse(storedData);
  const [amount,setamount] = useState(0);
  const [password,setPassword] = useState('');
  const [famInc,setFamInc] = useState(0);
  const [redirect,setRedirect] = useState(false);
  const [dash,setDash] = useState(false);

  const formatDateToIndianFormat = (date) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-IN', options);
  };
  
  const currentDate = new Date();
  const date = formatDateToIndianFormat(currentDate);

      const loan = async (e) => {
        e.preventDefault();
        
        if(parsedData === null) {
          setRedirect(true)
          alert("please first login")
        }
        else{
          const id = parsedData?.id;
          const response = await fetch('http://localhost:4000/loan', {
                method: 'POST',
                body: JSON.stringify({id,famInc, amount, password, date}),
                headers: {'Content-Type':'application/json', Accept: "application/json"},
                credentials: 'include',
          })
          if (response.ok) {
            alert('Loan successful.');
            setDash(true);
          } else {
            try {
              const errorData = await response.json();
              alert(errorData.error);
            } catch (error) {
              console.error('Error parsing response JSON', error);
              alert('An error occurred, please try again.');
            }
            setamount(0);
        setPassword('');
        setFamInc(0);
          }
        }
        
      }
      if(dash){
        return <Navigate to={'/dashboard'}/>
      }

      if(redirect){
        return <Navigate to={'/login'}/>
      }


  return (
    <Container>
      <TwoColumn>
        <ImageColumn>
          <Image imageSrc={EmailIllustrationSrc} />
        </ImageColumn>
        <TextColumn textOnLeft={textOnLeft}>
          <TextContent>
            {subheading && <Subheading>{subheading}</Subheading>}
            <Heading>{heading}</Heading>
            <Form onSubmit={loan}>
              <Input type="number" name="number" placeholder="Loan Amount" value={amount} onChange={e => setamount(e.target.value)}/>
              <Input type="number" name="famInc" placeholder="Family Income" value={famInc} onChange={e => setFamInc(e.target.value)}/>
              <Input type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
              <SubmitButton type="submit">{submitButtonText}</SubmitButton>
            </Form>
          </TextContent>
        </TextColumn>
      </TwoColumn>
    </Container>
  );

}

export default FormBankLoan