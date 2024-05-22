const timeElement = document.getElementById('time');
var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
// Set to the current date
const currentDate = (new Date(Date.now() - tzoffset)).toISOString().slice(0,16);
timeElement.value = currentDate;
timeElement.max = currentDate;

const bathEl = document.getElementById('bath-time');
const pkuEl = document.getElementById('pku-time');
const vitalsEl = document.getElementById('vitals-time');

function isDayShift() {
    const hour = (new Date()).getHours();
    return hour >= 7 && hour < 19;
}

function updateTimes(){
    const birthTime = new Date(timeElement.value);
    const formatter = new Intl.DateTimeFormat("en-US", {
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });

    const bathDueTime = new Date(birthTime.getTime()+12*60*60*1000);
    bathEl.innerText = formatter.format(bathDueTime);
    if (bathDueTime.getTime() < Date.now()) {
        bathEl.classList.add('strike')
    } else {
        bathEl.classList.remove('strike')
    }
    
    const oneDayAfterBirth = new Date(birthTime.getTime()+24*60*60*1000)
    const pkuDueTime = new Date(oneDayAfterBirth.getTime() + 60*1000);
    pkuEl.innerText = formatter.format(pkuDueTime);

    // If it has been more than one day since the baby was born,
    // vitals are needed every 8 hours
    // If it has been less, vitals are needed every 4 hours
    const intervalHours = Date.now() > oneDayAfterBirth.getTime() ? 8 : 4;
    let vitalsDueTime = new Date(birthTime.getTime());
    while (vitalsDueTime.getTime() < Date.now()) {
        vitalsDueTime.setHours(vitalsDueTime.getHours()+intervalHours);
    }
    vitalsEl.innerText = `Every ${intervalHours} hours (next: ${formatter.format(vitalsDueTime)})`;
}
timeElement.addEventListener('input', updateTimes)
updateTimes();