// Define UI elements
let ui = {
    timer: document.getElementById('timer'),
    robotState: document.getElementById('robot-state').firstChild,

    subsystems: {
      // elevator: document.getElementById('elevator-position'),
      // wristPos: document.getElementById('wrist-position'),
      // wristSpeed: document.getElementById('wrist-speed'),
      intakeMode: document.getElementById('intake-mode'),
      // intakeState: document.getElementById('intake-state'),
      hatchState: document.getElementById('hatch-state'),
    }

};

// Key Listeners


NetworkTables.addKeyListener('/SmartDashboard/wrist/wristState', (key, value) => {
  ui.subsystems.intakeMode.textContent = value;
})

NetworkTables.addKeyListener('/SmartDashboard/intake/hatchOpen', (key, value) => {
  ui.subsystems.hatchState.textContent = value ? "OPEN" : "CLOSED";
})

NetworkTables.addKeyListener('/robot/time', (key, value) => {
    // This is an example of how a dashboard could display the remaining time in a match.
    // We assume here that value is an integer representing the number of seconds left.
    ui.timer.textContent = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60;
});



// The rest of the doc is listeners for UI elements being clicked on
ui.example.button.onclick = function() {
    // Set NetworkTables values to the opposite of whether button has active class.
};


addEventListener('error',(ev)=>{
    ipc.send('windowError',{mesg:ev.message,file:ev.filename,lineNumber:ev.lineno})
})
