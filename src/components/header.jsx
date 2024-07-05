import axiomlogo from "../assets/images/axiom_logo.svg";
import orange_circle from "../assets/images/orange_circle.png";
import left_orange_circle from "../assets/images/left_orange_circle.png";
import React from 'react';
import burger from "../assets/images/burger.svg";
import button_trade from "../assets/images/button_trade.svg";
import board from "../assets/images/board.png";


const Header = () => {

    return ( 
        <>
            <header id="header" className="header">
                <div className="wrapper_">
                    <div className="header-nav-bar">
                        <div className="header-nav">
                            <img className="burger" src={burger} alt="" />
                            <img className="axiomlogo" src={axiomlogo} alt="" />
                            <nav>
                                <a href="https://datacenter.axiom-wm.com/" target="_blank">Главная</a>
                                <a href="https://datacenter.axiom-wm.com/#rec734070353" target="_blank">Услуги</a>
                                <a href="https://datacenter.axiom-wm.com/#rec734096760" target="_blank">Оборудование</a>
                                <a href="https://datacenter.axiom-wm.com/#rec734099507" target="_blank">Размещение</a>
                                <a href="" target="_blank">Приумножение BTC</a>
                                {/* <a href="" target="_blank">Партнерам</a> */}
                                <div className="board">
                                    <img className="board_img"  src={board} alt="" />
                                    <p>88005503590</p>
                                </div>
                                <img className="button_trade" src={button_trade} alt="" />
                            </nav>
                        </div>
                    </div>
                </div>
                <img className="orange-circle" src={orange_circle} alt="" />
                <img className="left_orange_circle" src={left_orange_circle} alt="" />
            </header>
        </>
    );
}

export default Header;