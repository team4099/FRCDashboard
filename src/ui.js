
document.getElementById("numbers").innerHTML = NetworkTables.getValue("/SmartDashboard/number");
document.getElementById("climber-state").innerHTML = NetworkTables.getValue("/SmartDashboard/climber/climberState");
document.getElementById("elevator-position").innerHTML = NetworkTables.getValue("/SmartDashboard/elevator/elevatorHeight");
document.getElementById("intake-state").innerHTML = NetworkTables.getValue("/SmartDashboard/intake/intakePower");
document.getElementById("intake-mode").innerHTML = NetworkTables.getValue("value");
document.getElementById("hatch-panel-state").innerHTML = NetworkTables.getValue("number");


// Define UI elements
let ui = {
    timer: document.getElementById('timer'),
    robotState: document.getElementById('robot-state').firstChild,
    gyro: {
        container: document.getElementById('gyro'),
        val: 0,
        offset: 0,
        visualVal: 0,
        arm: document.getElementById('gyro-arm'),
        number: document.getElementById('gyro-number')
    },
    robotDiagram: {
        arm: document.getElementById('robot-arm'),
        intake: document.getElementById('intake')
    },
    example: {
        button: document.getElementById('example-button'),
        readout: document.getElementById('example-readout').firstChild
    },
    autoSelect: document.getElementById('auto-select'),
    climberStateEntry: document.getElementById("climber-state"),
    elevatorPositionEntry: document.getElementById("elevator-position"),
    intakeStateEntry: document.getElementById("intake-state"),
    // intakeModeEntry: document.getElementById("intake-mode"),
    hatchPanelStateEntry: document.getElementById("hatch-panel-state"),
    wristPositionEntry: document.getElementById('arm-position')


};

// Key Listeners
// Gyro rotation
let updateGyro = (key, value) => {
    ui.gyro.val = value;
    ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
    if (ui.gyro.visualVal < 0) {
        ui.gyro.visualVal += 360;
    }
    ui.gyro.arm.style.transform = `rotate(${ui.gyro.visualVal}deg)`;
    ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
};
NetworkTables.addKeyListener('/SmartDashboard/drive/navx/yaw', updateGyro);

// The following case is an example, for a robot with an arm at the front.
NetworkTables.addKeyListener('/SmartDashboard/arm/encoder', (key, value) => {
    // 0 is all the way back, 1200 is 45 degrees forward. We don't want it going past that.
    if (value > 100) {
        value = 100;
    }
    else if (value < 0) {
        value = 0;
    }
    // Calculate visual rotation of arm
    var armAngle = value;
    // Rotate the arm in diagram to match real arm
    ui.robotDiagram.intake.style.transform = `rotate(${armAngle}deg)`
    //ui.robotDiagram.intake.rotate(40)
});

// This button is just an example of triggering an event on the robot by clicking a button.
NetworkTables.addKeyListener('/SmartDashboard/example_variable', (key, value) => {
    // Set class active if value is true and unset it if it is false
    ui.example.button.classList.toggle('active', value);
    ui.example.readout.data = 'Value is ' + value;
});

NetworkTables.addKeyListener('/robot/time', (key, value) => {
    // This is an example of how a dashboard could display the remaining time in a match.
    // We assume here that value is an integer representing the number of seconds left.
    ui.timer.innerHTML = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60;

});

// Add listeners for state changes
NetworkTables.addKeyListener('/SmartDashboard/climber/climberState', (key, value) => {
    ui.climberStateEntry.innerHTML = value;
    ui.climberStateEntry.value = NetworkTables.getValue('/SmartDashboard/climber/climberState');
});

NetworkTables.addKeyListener('/SmartDashboard/elevator/elevatorState', (key, value) => {
    ui.elevatorPositionEntry.innerHTML = value;
});

NetworkTables.addKeyListener('/SmartDashboard/intake/intakeState', (key, value) => {
    ui.intakeStateEntry.innerHTML = value;
});

NetworkTables.addKeyListener('/SmartDashboard/wrist/wristState', (key, value) => {
    ui.wristPositionEntry.innerHTML = value;
});

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/autonomous/modes', (key, value) => {
    // Clear previous list
    while (ui.autoSelect.firstChild) {
        ui.autoSelect.removeChild(ui.autoSelect.firstChild);
    }
    // Make an option for each autonomous mode and put it in the selector
    for (let i = 0; i < value.length; i++) {
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(value[i]));
        ui.autoSelect.appendChild(option);
    }
    // Set value to the already-selected mode. If there is none, nothing will happen.
    ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
});

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/autonomous/selected', (key, value) => {
    ui.autoSelect.value = value;
});

// The rest of the doc is listeners for UI elements being clicked on
ui.example.button.onclick = function() {
    // Set NetworkTables values to the opposite of whether button has active class.
    NetworkTables.putValue('/SmartDashboard/example_variable', this.className != 'active');
};
// Reset gyro value to 0 on click
ui.gyro.container.onclick = function() {
    // Store previous gyro val, will now be subtracted from val for callibration
    ui.gyro.offset = ui.gyro.val;
    // Trigger the gyro to recalculate value.
    updateGyro('/SmartDashboard/drive/navx/yaw', ui.gyro.val);
};
// Update NetworkTables when autonomous selector is changed
ui.autoSelect.onchange = function() {
    NetworkTables.putValue('/SmartDashboard/autonomous/selected', this.value);
};
// Get value of arm height slider when it's adjusted
ui.armPosition.oninput = function() {
    NetworkTables.putValue('/SmartDashboard/arm/encoder', parseInt(this.value));
};

addEventListener('error',(ev)=>{
    ipc.send('windowError',ev)
})
