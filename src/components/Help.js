import React, { useState, useEffect, useContext, useRef } from 'react';
import HistoryContext from '../store/contexts/History.context';
import { transitionPage } from '../Functions';

const sections = [
    [{label: 'Overview', content: `Choosie is a service for simplifying movie selection. With Choosie you have a guide to help you find the perfect movie, as well as a tool for organizing your movie-watching activity in the future. Additionally, Choosie lends itself as a resource for viewing information related to any movie in its 500,000 title catalog as well as what is new and popular in the Choosie community. If you can't decide on a movie, just use Choosie!`}, {label: 'Start', content: `Selecting the 'Start' button on the home screen will initiate a questionnaire to help you find the kind of movies you're looking for. You will be able to select one or more answers to each question, advancing by selecting the blue button in the bottom right during each phase.`}, {label: 'My List', content: `You can navigate to a personal store of saved movies by selecting 'My List' from the home screen or navigation bar. Here you'll be able to keep track of any movies on your "to-watch" list and any others you don't want to forget about. You can create multiple 'bins' to store related movies and label them to your preference in order to manage your collection more easily.`}, {label: 'Popular', content: `In 'Popular' you can view movies that are currently trending, were released recently, or have been saved by many other users on both a short- and long-term basis.`}],
    [{label: 'About Me', content: `My name is Nick Barak and I'm a self-taught developer. I recently graduated from the University of California, Santa Barbara with a degree in Economics & Accounting and am currently pursuing a career in software engineering. Choosie is my first major project and I am happy to have been able to utilize a lot of the things that I have learned since I started learning to code in the creation of this application. This project is the first of many to come.`}, {label: 'Contact', content: `You can contact me by email at nicholasjbarak@gmail.com. I am always looking for feedback for improvement so don't hesitate to send me suggestions or complaints.`}]
], slogan = `Choosie is the solution for those without problems.`;

function Help() {
    const history = useContext(HistoryContext);
    const frame = useRef(null);

    useEffect(_=> { document.getElementById('root').style.opacity = 1 }, []
    );

    const [state, setState] = useState({
        more: false,
        sections: sections[0]
    });

    useEffect(_=> setState({...state, sections: sections[state.more ? 1 : 0]}), [state.more]);

    return (
        <div className="container">
            <div className="help">
                <h2>What is <span style={{ fontWeight: 600 }} className="logo">Choosie</span>?</h2>
                <article style={{ width: '100%' }}>
                    <br />
                    <div style={{ fontWeight: 'bold' }}>{slogan}</div>
                    <br />
                    <div ref={frame}>
                        {state.sections.map((section, i) =>
                            <section key={i}>
                                <label>{section.label}</label>
                                <div>{section.content}</div>
                            </section>
                        )}
                    </div>
                </article>
                <div style={{ position: 'relative', display: 'flex', width: '100%' }}>
                    <button className="button-v2"  onClick={_=> transitionPage(history, '/')}>Back to Home</button>
                    <button style={{ right: 0, left: 'auto'}} className="button-v2" onClick={_=> {
                        frame.current.style.opacity = 0;
                        setTimeout(_=> {
                            setState({...state, more: !state.more});
                            history.push('/help');
                            frame.current.style.opacity = 1;
                        }, 750);
                    }}>{state.more ? 'Previous' : 'More'}</button>
                </div>
            </div>
        </div>
    )
}

export default Help
