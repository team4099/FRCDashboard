// Define UI elements
let ui = {

    timer: document.getElementById('timer'),
    robotState: document.getElementById('robot-state').firstChild,
    startingIntake: document.getElementById('starting-intake-mode'),
    startingAutoMode: document.getElementById('starting-auto-mode'),
    startingPosition: document.getElementById('starting-position'),
    startingHeight: document.getElementById('starting-height'),

    subsystems: {
      elevator: document.getElementById('elevator-position'),
      //wristPos: document.getElementById('wrist-position'),
      //wristSpeed: document.getElementById('wrist-speed'),
      intakeMode: document.getElementById('intake-mode'),
      //intakeState: document.getElementById('intake-state'),
      hatchState: document.getElementById('hatch-state'),
    }

};

// Key Listeners
//Wrist State


NetworkTables.addKeyListener('/SmartDashboard/elevator/elevatorHeight', (key, value) => {
    ui.subsystems.elevator.textContent = value;
});

/*NetworkTables.addKeyListener('/SmartDashboard/wrist/wristAngle', (key, value) => {
    ui.subsystems.wristPos.textContent = value;
});*/

/*NetworkTables.addKeyListener('/SmartDashboard/wrist/wristSpeed', (key, value) => {
    ui.subsystems.wristSpeed.textContent = value;
});*/

NetworkTables.addKeyListener('/SmartDashboard/wrist/wristState', (key, value) => {
    ui.subsystems.intakeMode.textContent = value;
});

/*NetworkTables.addKeyListener('/SmartDashboard/intake/intakeState', (key, value) => {
    ui.subsystems.intakeState.textContent = value;
});*/

NetworkTables.addKeyListener('/SmartDashboard/intake/hatchOpen', (key, value) => {
    ui.subsystems.hatchState.textContent = value ? "OPEN" : "CLOSED";
});



NetworkTables.addKeyListener('/robot/time', (key, value) => {
    // This is an example of how a dashboard could display the remaining time in a match.
    // We assume here that value is an integer representing the number of seconds left.
    ui.timer.textContent = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60;
});



// The rest of the doc is listeners for UI elements being clicked on
ui.example.button.onclick = function() {
    // Set NetworkTables values to the opposite of whether button has active class.
};

// Update NetworkTables when autonomous selector is changed
ui.startingIntake.onchange = function() {
    NetworkTables.putValue('/SmartDashboard/autonomous/selectedIntake', this.value);
};

ui.startingAutoMode.onchange = function() {
    NetworkTables.putValue('/SmartDashboard/autonomous/selectedAutoMode', this.value);
};

ui.startingPosition.onchange = function() {
    NetworkTables.putValue('/SmartDashboard/autonomous/selectedPosition', this.value);
};

ui.startingHeight.onchange = function() {
    NetworkTables.putValue('/SmartDashboard/autonomous/selectedHeight', this.value);
};

addEventListener('error',(ev)=>{
    ipc.send('windowError',{mesg:ev.message,file:ev.filename,lineNumber:ev.lineno})
});
