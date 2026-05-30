import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './pics/logo.png';
import convo from './pics/convo.png';
import chats from './pics/chats.png';
import "./frontpage.css";

const Frontpage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="super">
      <div className="herof">
        <div className="upperb">
          <div className="imagesup">
            <img src={logo} alt="Logo" />
          </div>
          <div className="buttonsup">
            <button className="regeb" onClick={() => navigate('/signup')}>
              Register
            </button>
            <button className="logeb" onClick={() => navigate('/login')}>
              Log in
            </button>
          </div>
        </div>
        <div className="line"></div>
        <div className="box1">
          <div className="image1">
            <img src={convo} alt="convo" width={"450px"} />
          </div>
          <div className="comp">
            <div className="text">
              <p>Your information</p>
              <p className="beut">Secured</p>
            </div>
            <p className="lor">
              Our platform prioritizes your privacy and security. Rest assured that your personal information is protected with advanced encryption and is never shared without your consent.
            </p>
          </div>
        </div>
        <div className="line l2"></div>
        <div className="box1">
          <div className="comp">
            <div className="text">
              <p>Your Chats</p>
              <p className="beut">Encrypted</p>
            </div>
            <p className="lor">
              Every conversation you have on our platform is encrypted end-to-end. This ensures that your messages remain private and secure, visible only to you and your intended recipient.
            </p>
          </div>
          <div className="image1">
            <img src={chats} alt="chats" width={"450px"} />
          </div>
        </div>
        <div className="line l2"></div>
        <p className="contact">Contact us: Juicepilado@gmail.com</p>
      </div>
    </div>
  );
};

export default Frontpage;
