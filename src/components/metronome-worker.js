// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    var timerID=null;
    var interval=100;
    
    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (e) => {
        if (e.data === "start") {
            timerID=setInterval(function(){postMessage("tick");},interval)
        }
        else if (e.data.interval) {
            interval=e.data.interval;
            if (timerID) {
                clearInterval(timerID);
                timerID=setInterval(function(){postMessage("tick");},interval)
            }
        }
        else if (e.data === "stop") {
            clearInterval(timerID);
            timerID=null;
        }
    };
}