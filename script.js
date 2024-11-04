// Dark Mode Toggle
let isDarkMode = false;
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const modeButton = document.getElementById("darkModeToggle");
    isDarkMode = !isDarkMode;
    modeButton.innerHTML = isDarkMode ? 
        '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
}

// Analog Clock Variables
const analogClock = {
    hourHand: document.querySelector(".hour-hand"),
    minuteHand: document.querySelector(".minute-hand"),
    secondHand: document.querySelector(".second-hand")
};

const timezones = document.getElementById("timezoneSelect");
let currentTimezone = "Asia/Kolkata";
let alarmTime = null;
let alarmActive = false;  // To track if an alarm is currently set

// Set a default message for the alarm status
const alarmMessageElement = document.getElementById("alarmMessage");
alarmMessageElement.textContent = "No Alarm Set"; // Default message

// Clock Update Function
function updateClock() {
    const now = new Date().toLocaleString("en-US", { timeZone: currentTimezone });
    const time = new Date(now);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    analogClock.hourHand.style.transform = `rotate(${(hours % 12) * 30 + minutes * 0.5 - 90}deg)`;
    analogClock.minuteHand.style.transform = `rotate(${minutes * 6 - 90}deg)`;
    analogClock.secondHand.style.transform = `rotate(${seconds * 6 - 90}deg)`;

    document.getElementById("digitalClock").textContent = time.toLocaleTimeString();

    // Check if the current time matches the alarm time
    if (alarmActive && alarmTime && time >= alarmTime) {
        triggerAlarm();
    }
}

// Timezone Update Function
function updateTimezone() {
    if (!alarmActive) { // Disable timezone change when alarm is active
        currentTimezone = timezones.value;
        updateClock();
        updateDateAndDay(currentTimezone); // Ensure the date updates with timezone change
    }
}

// Alarm Sound and Loop Control
const alarmSound = new Audio("pika-pikachu-alarm.mp3");  // Replace with actual sound URL or path
alarmSound.volume = 1.0;  // Set volume to maximum
let isAlarmLooping = false; // Control flag to manage sound looping

// Show Alarm Settings and Set Default Time
function showAlarmSettings() {
    const now = new Date().toLocaleString("en-US", { timeZone: currentTimezone });
    const time = new Date(now);

    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    
    document.getElementById("alarmTime").value = `${hours}:${minutes}`;
    document.getElementById("alarmSeconds").value = seconds;

    document.getElementById("alarmSettings").style.display = "block";
    document.querySelector(".analog-clock").style.display = "none";
    document.getElementById("alarmButton").style.display = "none";
    document.getElementById("goBackButton").style.display = "inline-block";
}

// Go Back to Original State
function goBack() {
    document.getElementById("alarmSettings").style.display = "none";
    document.querySelector(".analog-clock").style.display = "block";
    document.getElementById("alarmButton").style.display = "inline-block";
}

// Alarm Functionality
function setAlarm() {
    const alarmInput = document.getElementById("alarmTime").value;
    const alarmSeconds = document.getElementById("alarmSeconds").value;
    if (!alarmInput) {
        alert("Please set a valid alarm time.");
        return;
    }

    const now = new Date().toLocaleString("en-US", { timeZone: currentTimezone });
    const currentTime = new Date(now);
    const [alarmHours, alarmMinutes] = alarmInput.split(":");

    alarmTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), alarmHours, alarmMinutes, alarmSeconds || 0);
    if (alarmTime < currentTime) {
        alarmTime.setDate(alarmTime.getDate() + 1);
    }

    alarmActive = true;
    timezones.disabled = true; // Disable timezone selection while alarm is active

    // Display the set alarm time
    alarmMessageElement.textContent = "Alarm Set: " + alarmTime.toLocaleTimeString();
    goBack();
}

// Trigger the alarm sound and show custom notification
function triggerAlarm() {
    isAlarmLooping = true;
    playAlarmLoop();

    // Show custom alarm notification
    const alarmNotification = document.getElementById("alarmNotification");
    alarmNotification.style.display = "block";
}

// Function to play and loop the alarm sound fully before restarting
function playAlarmLoop() {
    if (isAlarmLooping) {
        alarmSound.currentTime = 0; // Reset to the beginning
        alarmSound.play().catch(error => console.error("Error playing alarm:", error));

        // Loop the sound only after it fully ends
        alarmSound.onended = () => {
            if (isAlarmLooping) {
                playAlarmLoop();  // Recursively call to loop after end
            }
        };
    }
}

// Stop the alarm and reset the interface
function stopAlarm() {
    isAlarmLooping = false;
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alarmTime = null;
    alarmActive = false;

    // Hide custom alarm notification and reset alarm message
    document.getElementById("alarmNotification").style.display = "none";
    alarmMessageElement.textContent = "No Alarm Set";
    timezones.disabled = false;
}

// Initialize the clock
updateClock();
setInterval(updateClock, 1000); // Update clock every second

// Date and Day Update
function updateDateAndDay(timezone) {
    const date = new Date().toLocaleDateString('en-US', {
        timeZone: timezone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    document.getElementById('dateContainer').innerText = date;
}

// Initial date update based on current timezone
updateDateAndDay(currentTimezone);