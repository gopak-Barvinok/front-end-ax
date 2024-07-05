import axiomlogo from "../assets/images/axiom_logo.svg";
import React from 'react';
import ellipse_three_mobile from "../assets/images/ellipse_three_mobile.png";


const Footer = () => {

    return ( 
        <>
            <footer id="footer" className="footer">
                    <div className="footer-container">
                        <div className="footer-container-icon">
                            <img src={axiomlogo} alt="" />
                        </div>
                        <div className="footer-container-contant">
                            <h2>Copyright © 2023 AXIOM WM Family office</h2>
                            <p>Все права защищены.</p>
                        </div>
                        <img className="ellipse_three_mobile" src={ellipse_three_mobile} alt="" />
                    </div>
            </footer>
        </>
    );
}

export default Footer;