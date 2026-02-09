import { useEffect, useState } from "react";

const introTexts = [
  "Hej Charlotte",
  "Jag fastnade i en grej...",
  "Och tänkte att du kanske kan hjälpa"
];

const smsIntroText = "Först tänkte jag bara skicka ett sms.";
const firstText = "Vill du hänga med mig(och Arthur) på alla hjärtans dag?";

const afterChatTexts = [
  "Men ville göra det lite roligare",
  "Sååå...."
];

export default function App() {
  // Boot / fake loading i början
  const [showBoot, setShowBoot] = useState(true);

  // Cringe-meter direkt efter boot
  const [showCringeMeter, setShowCringeMeter] = useState(false);

  // Intro fade
  const [introIndex, setIntroIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(false);

  // SMS-Intro
  const [showSmsIntro, setShowSmsIntro] = useState(false);

  // Chat typing
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState("typing1");
  const [showChat, setShowChat] = useState(false);

  // Fade-texter efter chatten
  const [showAfterChat, setShowAfterChat] = useState(false);
  const [afterChatIndex, setAfterChatIndex] = useState(0);

  // Dramatic interlude
  const [showInterlude, setShowInterlude] = useState(false);

  // Huvudinbjudan / svar
  const [yes, setYes] = useState(false);

  // “explosions”-screen efter ouii
  const [showExplosion, setShowExplosion] = useState(false);

  // "Nej"-knappen animation & position
  const [noFlying, setNoFlying] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [noPos, setNoPos] = useState({ top: 0, left: 0 });

  // --- Boot / fake loading ---
  useEffect(() => {
    if (!showBoot) return;
    const timer = setTimeout(() => {
      setShowBoot(false);
      setShowCringeMeter(true); // efter boot → cringe-meter
    }, 6000);
    return () => clearTimeout(timer);
  }, [showBoot]);

  // Cringe-meter
  useEffect(() => {
    if (!showCringeMeter) return;
    const timer = setTimeout(() => {
      setShowCringeMeter(false);
      setShowIntro(true); // efter cringe-meter → intro-texter
    }, 6000); // hur länge cringe-meter visas
    return () => clearTimeout(timer);
  }, [showCringeMeter]);

  // Intro fade
  useEffect(() => {
    if (!showIntro) return;

    if (introIndex < introTexts.length - 1) {
      const timer = setTimeout(() => {
        setIntroIndex((prev) => prev + 1);
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowIntro(false);
        setShowSmsIntro(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [introIndex, showIntro]);

  // SMS-Intro
  useEffect(() => {
    if (!showSmsIntro) return;

    const timer = setTimeout(() => {
      setShowSmsIntro(false);
      setShowChat(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [showSmsIntro]);

  // Chat typing-animation: skriv -> pausa -> sudda ut -> done
  useEffect(() => {
    if (!showChat) return;

    let timer;

    if (phase === "typing1" && displayText.length < firstText.length) {
      timer = setTimeout(() => {
        setDisplayText(firstText.slice(0, displayText.length + 1));
      }, 70);
    }

    if (phase === "typing1" && displayText.length === firstText.length) {
      timer = setTimeout(() => setPhase("pause"), 1600);
    }

    if (phase === "pause") {
      timer = setTimeout(() => setPhase("deleting"), 700);
    }

    if (phase === "deleting" && displayText.length > 0) {
      timer = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, 35);
    }

    if (phase === "deleting" && displayText.length === 0) {
      timer = setTimeout(() => {
        setPhase("done");
      }, 500);
    }

    if (phase === "done" && showChat) {
      timer = setTimeout(() => {
        setShowChat(false);
        setShowAfterChat(true);
        setAfterChatIndex(0);
      }, 700);
    }

    return () => clearTimeout(timer);
  }, [displayText, phase, showChat]);

  // Fade-texter efter chatten
  useEffect(() => {
    if (!showAfterChat) return;

    if (afterChatIndex < afterChatTexts.length - 1) {
      const timer = setTimeout(() => {
        setAfterChatIndex((prev) => prev + 1);
      }, 2800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowAfterChat(false);
        setShowInterlude(true);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [afterChatIndex, showAfterChat]);

  // Interlude – lite töntig "thinking" skärm
  useEffect(() => {
    if (!showInterlude) return;

    const timer = setTimeout(() => {
      setShowInterlude(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, [showInterlude]);

  const getRandomNoPosition = () => {
    const maxTop = 80;
    const minTop = -40;
    const maxLeft = 140;
    const minLeft = -140;

    const top = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
    const left = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;

    return { top, left };
  };

  const handleNoClick = () => {
    if (noFlying) return;

    setNoFlying(true);

    setTimeout(() => {
      setNoPos(getRandomNoPosition());
      setNoFlying(false);
      setHasMoved(true);
    }, 800);
  };

  const handleYesClick = () => {
    setShowExplosion(true);
    setTimeout(() => {
      setShowExplosion(false);
      setYes(true);
    }, 1800);
  };

  // ---- RENDER ----

  // Boot / fake loading först
  if (showBoot) {
    return (
      <div className="container boot-container">
        <div className="boot-title">startar frågan...</div>
        <div className="boot-subtitle">laddar mod, testar töntnivå</div>
        <div className="boot-bar">
          <div className="boot-bar-fill" />
        </div>
      </div>
    );
  }

  // Cringe-meter
  if (showCringeMeter) {
    return (
      <div className="container cringe-container">
        <div className="cringe-title">nörd-mätare</div>
        <div className="cringe-bar">
          <div className="cringe-bar-fill" />
        </div>
        <div className="cringe-labels">
          <span>lugn</span>
          <span>mm...</span>
          <span>oj då</span>
        </div>
      </div>
    );
  }

  // Intro
  if (showIntro) {
    return (
      <div className="container intro-container">
        <h1 key={introIndex} className="fade-text intro-glitch">
          {introTexts[introIndex]}
        </h1>
      </div>
    );
  }

  // SMS-intro
  if (showSmsIntro) {
    return (
      <div className="container">
        <p className="fade-text sms-text">{smsIntroText}</p>
      </div>
    );
  }

  // Chat-bubbla
  if (showChat) {
    return (
      <div className="container">
        <div className={`chat-bubble ${phase === "typing1" ? "bubble-shake" : ""}`}>
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

  // Interlude – “analyserar läget...”
  if (showInterlude) {
    return (
      <div className="container interlude-container">
        <div className="interlude-title">analyserar läget...</div>
        <div className="interlude-bar">
          <div className="interlude-bar-fill" />
        </div>
        <div className="interlude-stars">
          <span>*</span>
          <span>*</span>
          <span>*</span>
        </div>
      </div>
    );
  }

  // Explosion-screen efter ouii
  if (showExplosion) {
    return (
      <div className="container explosion-container">
        <div className="explosion-circle" />
        <div className="explosion-text">BOOM</div>
        <div className="explosion-subtext"></div>
      </div>
    );
  }

  // Huvudinbjudan / svar
  return (
    <div className="container">
      {!yes ? (
        <>
          <p>
            Något enkelt! Mat, något glas, och massa skitsnack.
          </p>

          <p>
            Hade varit kul!!
          </p>

          <h2>Vad säger du?</h2>

          <div className="buttons-wrapper">
            <button className="yes-btn" onClick={handleYesClick}>
              ouii
            </button>

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
              Nä, usch
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="dunder-text">Toppp</h1>
          <p className="dunder-subtext">Kan höras närmre inpå!!</p>
        </>
      )}
    </div>
  );
}