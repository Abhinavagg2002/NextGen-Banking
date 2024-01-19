import React from "react";
import GlobalStyles from 'styles/GlobalStyles';
import { css } from "styled-components/macro"; //eslint-disable-line
import SaaSProductLandingPage from "demos/SaaSProductLandingPage";
import Login from "pages/Login";
import Signup from "pages/Signup";
import { Route, Routes } from "react-router-dom";
import ContactUs from "pages/ContactUs";
import Form_Deposit from "pages/Form_Deposit";
import FormWithdrawl from "pages/FormWithdrawl";
import FormTransfer from "pages/FormTransfer";
import FormLoan from "pages/FormLoan";
//import Dashboard from "dashboard/pages/Dashboard";
import TermsOfService from "pages/TermsOfService";
import PrivacyPolicy from "pages/PrivacyPolicy";
import ProfileThreeColGrid from "components/cards/ProfileThreeColGrid";
import { UserContextProvider } from "./UserContext";
import ProfilePage from "Profile/ProfilePage";
import Dashboard2 from "Dashboard_2/Dashboard2";


export default function App() {
  return (
    <>
    <GlobalStyles/>
    <UserContextProvider>
        <Routes>
          <Route path = "/" element = {<SaaSProductLandingPage/>}/>
          <Route path = "/login" element = {<Login/>}/>
          <Route path = "/signup" element = {<Signup/>}/>
          <Route path = "/contact" element = {<ContactUs/>}/>
          <Route path = "/deposit" element = {<Form_Deposit/>}/>
          <Route path = "/withdrawl" element = {<FormWithdrawl/>}/>
          <Route path = "/transfer" element = {<FormTransfer/>}/>
          <Route path = "/loan" element = {<FormLoan/>} />
          <Route path = "/profile" element= {<ProfilePage/>}/>
          <Route path = "/dashboard" element= {<Dashboard2/>} />
          <Route path="terms" element = {<TermsOfService/>}/>
          <Route path="privacy" element = {<PrivacyPolicy/>}/>
          <Route path="team" element = {<ProfileThreeColGrid/>}/>
        </Routes>
    </UserContextProvider>
    </>
  );
}
