
const width = 16
const height = 4

function generateGrid()  {
        var content = "";
        var row = 0;
        var colid= 0;
        for (var i = 0; i < width; i++) {
            content+= `<div class='column' id='${colid}'>`
            for (var j = 0; j < height; j++) {
                content+= `<div class='row' id='${colid}-${row}' onclick="cellClickHandler(${colid}, ${row})">`
                // content+= row // for debugging
                content+= "</div>"
                row++;
            }
            content+= "</div>";
            colid++;

        }
        document.getElementById("Grid").innerHTML = content;
}

function cellClickHandler(colid, rowid){
    console.log('Toggling', colid, rowid);
    document.getElementById(''+colid+'-'+rowid).classList.toggle('active1')
}

function toggleCol(i){
    let cols =  document.getElementsByClassName('column');
        let rows =  cols[i].getElementsByClassName('row');
        for(j=0;j<height;j++) {
            rows[j].classList.toggle('active');
        }
}

async function activeCol(i){
    toggleCol(i);
    await sleep(100);
    toggleCol(i);
}
function clearCols(){
    let cols =  document.getElementsByClassName('column');
    for(let i = 0; i < width; i++) {
        let rows =  cols[i].getElementsByClassName('row');
        for(j=0;j<height;j++) {
            rows[j].classList.remove('active');
        }
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


async function handlePlayPause(){
    playing = !playing;
    console.log({playing});
    document.getElementById('play-pause').innerText = playing ? 'Stop':'Play !';
    if(playing)Tone.Transport.start();
    if(!playing)Tone.Transport.stop();
}

function getStatus(col){
    var cols = document.getElementById(col);
    var rows = cols.getElementsByClassName('row');
    var status = [];
    for(j=0;j<height;j++) {
        status[j] = rows[j].classList.contains('active1');
    }
    return status;
}


async function enableToneJS(){

    // This is function uses ToneJS to generate beats and manage timings
    await sleep(100);
    const Tone = window.Tone;
    var keys = new Tone.Players({
        "hat" : "hat.wav",
        "kick" : "kick.wav",
        "snare" : "snare.wav",
        "clap" : "clap.wav",
    }, {
        "volume" : -10,
        "fadeOut" : "64n",
    }).toMaster();

    var noteNames = [ 'hat', 'kick', 'snare', 'clap'];
    var loop = new Tone.Sequence(function(time, col){
        const status = getStatus(col);
        for(let i=0;i<height;i++) {
            if (status[i]){
                var vel = Math.random() * 0.5 + 0.5;
                keys.get(noteNames[i]).start(time, 0, "32n", 0, vel);
            }
        }
        console.log('Beat')

        Tone.Draw.schedule(function(){
            activeCol(col);
        }, time);
    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n").start(0);

    Tone.Transport.on("stop", () => {
        setTimeout(() => {
            // Clear the moving active box on stop
            clearCols();
            console.log('Stop')
        }, 200);
    });


}


// Main
var playing = false;

generateGrid();
document.getElementById('play-pause').addEventListener('click', handlePlayPause);
enableToneJS();


