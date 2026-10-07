// The only React in the project: a small timer component.
// Uses React.createElement so no build step or JSX compiler is needed.
const { useState, useEffect, createElement: h } = React;

function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  function choose(m) {
    setMinutes(m);
    setSecondsLeft(m * 60);
    setRunning(false);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return h("div", null,
    h("div", { className: "timer-row" },
      [15, 25, 45].map(m =>
        h("button", {
          key: m,
          className: "ghost" + (minutes === m ? " active" : ""),
          onClick: () => choose(m)
        }, m + " min")
      )
    ),
    h("p", {
      className: "time" + (secondsLeft === 0 ? " finished" : ""),
      role: "timer"
    }, mm + ":" + ss),
    h("div", { className: "timer-row" },
      h("button", {
        onClick: () => setRunning(r => !r),
        disabled: secondsLeft === 0
      }, running ? "Pause" : "Start"),
      h("button", { className: "ghost", onClick: () => choose(minutes) }, "Reset")
    )
  );
}

ReactDOM.createRoot(document.getElementById("timer-root")).render(h(Timer));
