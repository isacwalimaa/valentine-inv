import { useEffect, useState } from "react";

const introTexts = [
  "Hej Charlotte",
  "Jag har en grej jag vill fråga dig...",
  "Och det handlar lite om Arthur 🐶",
];

const smsIntroText = "Först tänkte jag bara skicka ett sms...";
const firstText = "Vill du bli min valentin? // Arthur";

// Fade-texter efter chatten
const afterChatTexts = [
  "Men jag ville göra det på ett lite roligare sätt...",
  "Så..."
];

export default function App() {
  // Intro fade
  const [introIndex, setIntroIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  // SMS-Intro
  const [showSmsIntro, setShowSmsIntro] = useState(false);

  // Chat typing
  const [displayText, setDisplayText] = useState("");
  // typing1 -> pause -> deleting -> done
  const [phase, setPhase] = useState("typing1");
  const [showChat, setShowChat] = useState(false);

  // Fade-texter efter chatten
  const [showAfterChat, setShowAfterChat] = useState(false);
  const [afterChatIndex, setAfterChatIndex] = useState(0);

  // Huvudinbjudan
  const [yes, setYes] = useState(false);

  // "Nej"-knappen animation & position
  const [noFlying, setNoFlying] = useState(false);
  const [hasMoved, setHasMoved] = useState(false); // har den flyttat sig minst en gång?
  const [noPos, setNoPos] = useState({ top: 0, left: 0 }); // används först efter första flygningen

  // Intro fade
  useEffect(() => {
    if (!showIntro) return;

    if (introIndex < introTexts.length - 1) {
      const timer = setTimeout(() => {
        setIntroIndex((prev) => prev + 1);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowIntro(false);
        setShowSmsIntro(true); // visa SMS-intro först
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [introIndex, showIntro]);

  // SMS-Intro
  useEffect(() => {
    if (!showSmsIntro) return;

    const timer = setTimeout(() => {
      setShowSmsIntro(false);
      setShowChat(true); // starta chat-animation
    }, 3000); // visa SMS-intro i 3 sek
    return () => clearTimeout(timer);
  }, [showSmsIntro]);

  // Chat typing-animation: skriv -> pausa -> sudda ut -> done
  useEffect(() => {
    if (!showChat) return;

    let timer;

    // Skriv första texten
    if (phase === "typing1" && displayText.length < firstText.length) {
      timer = setTimeout(() => {
        setDisplayText(firstText.slice(0, displayText.length + 1));
      }, 80);
    }

    // När första texten är klar: kort paus
    if (phase === "typing1" && displayText.length === firstText.length) {
      timer = setTimeout(() => setPhase("pause"), 1500);
    }

    // Pausfas → börja sudda
    if (phase === "pause") {
      timer = setTimeout(() => setPhase("deleting"), 800);
    }

    // Sudda ut texten
    if (phase === "deleting" && displayText.length > 0) {
      timer = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, 40);
    }

    // När allt är borttaget → done
    if (phase === "deleting" && displayText.length === 0) {
      timer = setTimeout(() => {
        setPhase("done");
      }, 500);
    }

    // När chatten är helt klar → stäng chatten, starta efterChat-fade
    if (phase === "done" && showChat) {
      timer = setTimeout(() => {
        setShowChat(false);      // göm chatten
        setShowAfterChat(true);  // visa efterChat-texter
        setAfterChatIndex(0);
      }, 800); // liten paus efter att allt suddats ut
    }

    return () => clearTimeout(timer);
  }, [displayText, phase, showChat]);

  // Fade-texter efter chatten
  useEffect(() => {
    if (!showAfterChat) return;

    if (afterChatIndex < afterChatTexts.length - 1) {
      const timer = setTimeout(() => {
        setAfterChatIndex((prev) => prev + 1);
      }, 3000); // hur länge varje text visas
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowAfterChat(false); // klart, visa huvudinbjudan
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [afterChatIndex, showAfterChat]);

  // Slumpa fram en ny position i knapplayouten
  const getRandomNoPosition = () => {
    // Begränsa så den håller sig ungefär i området runt knapparna
    const maxTop = 80;   // px neråt
    const minTop = -40;  // px uppåt
    const maxLeft = 140; // px höger
    const minLeft = -140; // px vänster

    const top = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
    const left = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;

    return { top, left };
  };

  // Klick på "Nej" – trigga flyg-animation, sedan landa på ny plats
  const handleNoClick = () => {
    if (noFlying) return; // förhindra spam medan den flyger

    setNoFlying(true);

    // Efter animationen: uppdatera position och avsluta flyg
    setTimeout(() => {
      setNoPos(getRandomNoPosition());
      setNoFlying(false);
      setHasMoved(true); // från och med nu är knappen "flygande"
    }, 800); // samma som animationens längd i CSS
  };

  // ---- RENDER ----

  // Intro
  if (showIntro) {
    return (
      <div className="container">
        <h1 key={introIndex} className="fade-text">
          {introTexts[introIndex]}
        </h1>
      </div>
    );
  }

  // SMS-intro
  if (showSmsIntro) {
    return (
      <div className="container">
        <p className="fade-text">{smsIntroText}</p>
      </div>
    );
  }

  // Chat-bubbla
  if (showChat) {
    return (
      <div className="container">
        <div className="chat-bubble">
          {displayText}
          <span className="cursor" />
        </div>
      </div>
    );
  }

  // Fade-texter efter chatten
  if (showAfterChat) {
    return (
      <div className="container">
        <h1 key={afterChatIndex} className="fade-text">
          {afterChatTexts[afterChatIndex]}
        </h1>
      </div>
    );
  }

  // Huvudinbjudan
  return (
    <div className="container">
      {!yes ? (
        <>
          <h1>Hej</h1>

          <p>
            Arthur ville jättegärna hänga med dig på alla hjärtans dag
          </p>

          <p>
            Så om du inte har något bättre för dig, så skulle det vara superkul om du ville bli vår valentin!
          </p>

          <h2>Vad säger du?</h2>

          {/* Relativ container för nej-knappens flygzon */}
          <div className="buttons-wrapper">
            <button className="yes-btn" onClick={() => setYes(true)}>
              ouii
            </button>

            {/* Nej-knapp: vanlig layout först, absolut position först efter första flygningen */}
            <button
              className={`no-btn ${noFlying ? "fly-away" : ""}`}
              onClick={handleNoClick}
              style={
                hasMoved
                  ? {
                      position: "absolute",
                      top: `${noPos.top}px`,
                      left: `${noPos.left}px`,
                    }
                  : {
                      marginLeft: "12px",
                    }
              }
            >
              Nej 😈 (testa tryck på mig)
            </button>
          </div>
        </>
      ) : (
        <>
          <h1>Dunder!!!!!</h1>
          <img
          src="/ar.jpg"       // ligger i public/arthur.png
          alt="Arthur"
          className="arthur-img"
        />
        </>
      )}
    </div>
  );
}