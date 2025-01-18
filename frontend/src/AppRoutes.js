import React from "react";
import { Routes, Route } from "react-router-dom";
import Indexaboutus from "./components/Indexpage/Indexaboutus.jsx";
import Indexourcrew from "./components/Indexpage/Indexourcrew.jsx";
import IndexServices from "./components/Indexpage/Indexservices.jsx";
import Navbar from "./components/Indexpage/Navbar.jsx";
import Ourservices from "./components/Ourservices.jsx";
import Login from "./components/login.jsx";
import Signup from "./components/Signup.jsx";
import Aboutus from "./components/aboutus.jsx";
import Register from "./components/register.jsx";
import Indexhero from "./components/Indexpage/Indexhero.jsx"
import EventForm from "./components/EventBookingForm.jsx"
import Footer from "./components/Indexpage/Footer.jsx";
import ForgotPassword from './components/Forgot_password.jsx';
import ResetPassword from './components/Reset_password.jsx';
import PhotosSection from "./components/ServicesPages/PhotosSection.jsx";
import ServicesSection from "./components/ServicesPages/ServicesSection.jsx";
import TopSection from "./components/ServicesPages/TopSection.jsx";
import PhotosSection1 from "./components/BirthdayservicesPages/PhotosSection.jsx";
import ServicesSection1 from "./components/BirthdayservicesPages/ServicesSection.jsx";
import TopSection1 from "./components/BirthdayservicesPages/TopSection.jsx";
import PhotosSection2 from "./components/CorperateServicesPages/PhotosSection.jsx";
import ServicesSection2 from "./components/CorperateServicesPages/ServicesSection.jsx";
import TopSection2 from "./components/CorperateServicesPages/TopSection.jsx";
import PhotosSection3 from "./components/SocialServicesPages/PhotosSection.jsx";
import ServicesSection3 from "./components/SocialServicesPages/ServicesSection.jsx";
import TopSection3 from "./components/SocialServicesPages/TopSection.jsx";
import ContactUs from "./components/ContactUs.jsx"
import Testimonials from "./components/Indexpage/Testimonials.jsx";
import AnimatePage from "./components/success.jsx"
import FAQ from "./components/FAQ.jsx"
import FeedBack from "./components/Feedback.jsx"
const AppRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={ 
          <>
  
              <Navbar/>
              <Indexhero/>
              <Indexaboutus/> 
              <IndexServices/>
              <Indexourcrew/>
              <Testimonials/>
              <Footer/>

          </>
        } 
      />
       
      <Route 
        path="/services" 
        element={
          <>
            <Navbar/>
            <Ourservices/>
        
          </>
        } 
      />
      <Route 
        path="/about" 
        element={<Aboutus/>} 
      />

    <Route 
        path="/contact" 
        element={<ContactUs></ContactUs>} 
      />

      <Route 
        path="/login" 
        element={
          <>
         <Login></Login>
          </>
        } 

      />


      <Route 
        path="/signup" 
        element={<Signup />} 
      />
       
       <Route 
        path="/aboutus" 
        element={<Aboutus/>} 
      />

     <Route 
        path="/register" 
        element={<Register/>} 
      />

   <Route
     path="/eventform"
     element={<EventForm />}
     />
       
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} /> 
      <Route
      path="/Wedding"

      element={
      <>
      <Navbar></Navbar>
      <TopSection/>
       <ServicesSection/>
      <PhotosSection/>
       <Footer/>   
      </>
      }
      />

     <Route
      path="/Birthday"

      element={
      <>
      <Navbar></Navbar>
      <TopSection1/>
       <ServicesSection1/>
      <PhotosSection1/>
       <Footer/>   
      </>
      }
      />


      
     <Route
      path="/corperate"

      element={
      <>
      <Navbar></Navbar>
      <TopSection2/>
       <ServicesSection2/>
      <PhotosSection2/>
       <Footer/>   
      </>
      }
      />


     <Route
      path="/social"

      element={
      <>
      <Navbar></Navbar>
      <TopSection3/>
       <ServicesSection3/>
      <PhotosSection3/>
       <Footer/>   
      </>
      }
      />

<Route path="/animate" element={<AnimatePage />} />

<Route path="/FAQ" element={<FAQ/>}/>
<Route path='/feedback'
      element={<FeedBack />}
      />
    </Routes>




  
      

  );
};

export default AppRoutes;
