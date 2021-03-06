import React, { useState, useEffect } from 'react';
import { DndProvider , useDrag, useDrop } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from 'react-dnd-touch-backend';
import { Switch, Route, Link } from 'react-router-dom';
import '../../styles/components/button.scss';
import '../../styles/components/nav.scss';
import classes from '../../styles/pages/low-carbon.module.scss';
import Intro from '../../components/Intro';
import axios from 'axios';
import Modal from '../../components/Modal';
import itemTypes from '../../components/ItemTypes';
import MyPreview from '../../components/MyPreview';
import { lowCarbonTravelGame, lowCarbonTravelAnswers} from './Data';
import Result from '../../components/Result';

// Icons and Images

import {FaTrain, FaCar, FaAngleDown} from 'react-icons/fa';
import { BiArrowBack, BiRevision } from "react-icons/bi";
import Background from '../../images/low-carbon/Game_1_screen_1.svg';
import Character from '../../images/low-carbon/Character_1_First_screen.svg';


const MovableItem = ({name, setItems, column, description, setInfo, index, icon}) => {
    const changeItemColumn = (currentItem, columnName) => {
        setItems((prevState) => {
            return prevState.map(e => {
                return {
                    ...e,
                    column: e.name === currentItem.name ? columnName : e.column,
                }
            })
        });
    }

    const [{ isDragging }, drag] = useDrag({
        item: { name, column, icon, type: itemTypes.CARD },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if(dropResult && dropResult.name === 'All'){
                changeItemColumn(item, 'All')
            } else if(dropResult && dropResult.name === '1') {
                changeItemColumn(item, '1') 
            } else if(dropResult && dropResult.name === '2') {
                changeItemColumn(item, '2')
            } else if(dropResult && dropResult.name === '3') {
                changeItemColumn(item, '3')
            } else if(dropResult && dropResult.name === '4') {
                changeItemColumn(item, '4')
            } else if(dropResult && dropResult.name === '5') {
                changeItemColumn(item, '5')
            } 
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });


    const opacity = isDragging ? 0.4 : 1;

    const handleClick = () => {
        if(column === "All" ) {
            setInfo([name, icon, description]);
        }
    }
    

    return (
        <div ref={drag} className={classes.Card} style={{opacity: opacity}}>
            <img src={icon} alt={name} onClick={handleClick}/>
        </div>
    )
}


const Column = ({children, className, title}) => {

    const [{isOver, canDrop}, drop] = useDrop({
        accept: itemTypes.CARD,
        drop: () => ({name: title}),
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
        canDrop: () => {
          return children.length === 0 || title === "All";
        }
    })


    return (
        <div ref={drop} className={className} >
            {children}
        </div>
    )

}


const Info = ({info, finalItems, submitAnswers}) => {
    const [show, setShow] = useState(false);
    const openModal = () => setShow(true);  
    const closeModal = () => setShow(false);
    if (finalItems.length === 5)
        return <button className="Btn-border" onClick={submitAnswers}>Complete!</button>
    else
        return(
            <>
            <div className={classes.Infobox}>
                <div>
                    <img src={info[1]} alt={info[0]}/>
                    <p>{info[0]}</p>
                </div>
                <a href="#" className={classes.Link} onClick={openModal}>
                    Read more <FaAngleDown fontSize="1.5rem"/>
                </a>
            </div>
            { show? <Modal title={info[0]} description={info[2]} show={show} closeModal={closeModal} icon={info[1]}/> : null }
            </>
        )
}

const LowCarbonTravelGame = () => {

    const game = lowCarbonTravelGame;
    const [items, setItems] = useState(lowCarbonTravelAnswers);
    const [info, setInfo] = useState([lowCarbonTravelAnswers[0].name,lowCarbonTravelAnswers[0].svg, lowCarbonTravelAnswers[0].description])
    const [active, setActive] = useState([lowCarbonTravelAnswers[0].name]);

    const isMobile = window.innerWidth < 600;


    const returnItemsForColumn = (columnName) => {
        return items
        .filter((item) => item.column === columnName)
        .map((item, index) => (
            <MovableItem key={item.id} name={item.name} description={item.description} column={item.column} setItems={setItems} index={index} setInfo={setInfo} active={active} setActive={setActive} icon={item.svg} />
        ))
    }

    // Style and logic for the needle in the speedometer and result 
    const massTransit = [];
    const electricCars = [];


    items.map(item => {
        if (item.category === "electric car ownership" && item.column !== "All") {
            electricCars.push(item);
        } else if (item.category === "mass transit" && item.column !== "All"){
            massTransit.push(item);
        }
        return item;
    })


    const setNeedleStyle = () => {
        let style = {};
        if (electricCars.length - massTransit.length === 1) {
            const firstStyle = {transform: 'translate(-50%, -50%) rotate(-30deg)'};
            style = Object.assign(style, firstStyle);
        }
        if (electricCars.length - massTransit.length === 2) {
            const secondStyle = {transform: 'translate(-50%, -50%) rotate(-45deg)'};
            style = Object.assign(style, secondStyle);
        }
        if (electricCars.length - massTransit.length === 3) {
            const thirdStyle = {transform: 'translate(-50%, -50%) rotate(-55deg)'};
            style = Object.assign(style, thirdStyle);
        }
        if (electricCars.length - massTransit.length === 4) {
            const fourthStyle = {transform: 'translate(-50%, -50%) rotate(-65deg)'};
            style = Object.assign(style, fourthStyle);
        }
        if (massTransit.length - electricCars.length === 1) {
            const fifthStyle = {transform: 'translate(-50%, -50%) rotate(+30deg)'};
            style = Object.assign(style, fifthStyle);
        }
        if (massTransit.length - electricCars.length === 2) {
            const sixthStyle = {transform: 'translate(-50%, -50%) rotate(+45deg)'};
            style = Object.assign(style, sixthStyle);
        }
        if (massTransit.length - electricCars.length === 3) {
            const seventhStyle = {transform: 'translate(-50%, -50%) rotate(+55deg)'};
            style = Object.assign(style, seventhStyle);
        }
        if (massTransit.length - electricCars.length === 4) {
            const eigthStyle = {transform: 'translate(-50%, -50%) rotate(+65deg)'};
            style = Object.assign(style, eigthStyle);
        }
        if (massTransit.length - electricCars.length === 0) {
            const ninthStyle = {transform: 'translate(-50%, -50%) rotate(0deg)'};
            style = Object.assign(style, ninthStyle);
        }
        if (massTransit.length - electricCars.length === 5) {
            const tenthStyle = {transform: 'translate(-50%, -50%) rotate(+90deg)'};
            style = Object.assign(style, tenthStyle);
        }
        if (electricCars.length - massTransit.length === 5) {
            const eleventhStyle = {transform: 'translate(-50%, -50%) rotate(-90deg)'};
            style = Object.assign(style, eleventhStyle);
        }

        return style;
    }

    // decides the result of the game based
    const result = () => {
        let result = ""
        if(massTransit.length > electricCars.length) {
           result = "You chose a future which is focused on an efficient, affordable, and clean public transport system. With an electrified rail and bus network, and vastly improved cycling infrastructure, we can generate more than 230,000 jobs and significantly improve public health whilst reducing transport emissions."
        } else {
            result = "You chose a future which focuses on improving accessibility, affordability and infrastructure, helping more people to own electric vehicles. Benefits include the creation of approximately 27,000 new jobs, savings of up to 75% on running costs, and reducing emissions down to zero!"
        }
        return result;
    }

    // retrieves guest user details from localStorage
    const guestDetails =JSON.parse(window.localStorage.getItem('guest'));
    
    // filters answers that are in the 5 selected columns
    const finalItems = items.filter((item) => item.column !== "All")

    // retrieves result from Local Storage
    const lowCarbonText = JSON.parse(window.localStorage.getItem('result1'));

    const [lowCarbonResult, setLowCarbonResult] = useState(lowCarbonText || "")
    // save the result to Local Storage
    useEffect(() => {
        window.localStorage.setItem('result1', JSON.stringify(lowCarbonResult));
    }, [lowCarbonResult])

    // Logic for persisting the answers in the DB: 

    // saves guest_answers to the DB     
    const submitAnswers = () => {

        const qs = require('qs');
        
        if(finalItems.length === 5 && guestDetails) {
            finalItems.forEach(answer => {
                axios.post('/api/answers', qs.stringify(
                    {
                        answer: {
                            guest_id: guestDetails.id,
                            name: answer.name,
                            description: answer.description,
                            column: answer.column,
                            category: answer.category,
                            game: answer.game
                    }
                }))
                .then(res => {
                    setLowCarbonResult(result())
                    handleRedirect(res)
                })
                    .catch(err => console.log(err))
                })
        }
    }
        
    const handleRedirect = (res) => {
        if(res.status === 201 || res.status === 200) {
            window.location = '/low-carbon/result'
        } else {
            window.location = '/low-carbon/game'
        }
    }
    
    const startOver = () => {
        setItems(lowCarbonTravelAnswers)
    }

    const gradient = "rgba(169, 219, 232, 1), rgba(255, 255, 255, 0.6)";

    return(
        <Switch>
            <Route path="/low-carbon/intro">
                <Intro
                    text={game.intro}
                    link='/low-carbon/game'
                    back='/user'
                    skip='/clean-energy/intro'
                    background={Background}
                    character={Character}
                    characterPosition="LowcarbonCharacter"
                    gradient={gradient}
                />
            </Route>
            <Route path="/low-carbon/game">
                <div className="GameNav">
                    <div className="NavLink">
                        <BiArrowBack className="LeftIcon"/>
                        <Link to='/low-carbon/intro'>Back</Link>
                    </div>
                    <div className="NavLink">
                        <a className="" onClick={startOver} >Start over  </a>
                        < BiRevision className="RightIcon"/>
                    </div>
                </div>
                <div className={classes.Background}>               
                    <div className={classes.Instructions}>
                        <p>{game.instructions}</p>
                    </div>   
                    <div className={classes.Container}>            
                        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend }>
                        {isMobile ?  <MyPreview classes={classes} /> : null }
                            <Column title='All' className={classes.Box}>
                                {returnItemsForColumn('All')}
                            </Column>
                            <Info info={info} finalItems={finalItems} submitAnswers={submitAnswers} />
                            <div className={classes.Choices}>
                            <Column title='1' className={classes.Selected}>
                                {returnItemsForColumn('1')}
                            </Column>
                            <Column title='2' className={classes.Selected}>
                                {returnItemsForColumn('2')}
                            </Column>
                            <Column title='3' className={classes.Selected}>
                                {returnItemsForColumn('3')}
                            </Column>
                            <Column title='4' className={classes.Selected}>
                                {returnItemsForColumn('4')}
                            </Column>
                            <Column title='5' className={classes.Selected}>
                                {returnItemsForColumn('5')}
                            </Column>
                            </div>
                        </DndProvider>
                        <div className={classes.Speedometer}>
                            <div className={classes.HalfCircle}></div>
                            <div className={classes.Needle} style={setNeedleStyle()}></div>
                            <div className={classes.Bottom}>
                                <FaCar color="white" fontSize="2rem" className={classes.MarginLeft} />
                                <FaTrain color="white" fontSize="2rem" className={classes.MarginRight} />
                            </div>
                        </div>
                    </div>
                </div>
            </Route>
            <Route path="/low-carbon/result">
                <Result 
                    gradient={gradient} 
                    background={Background} 
                    text={lowCarbonText} 
                    badge="You've earned the TRANSPORT BADGE"
                    back="/low-carbon/game"
                    next="/clean-energy/intro"
                />
            </Route>
        </Switch>
    )
}

export default LowCarbonTravelGame;