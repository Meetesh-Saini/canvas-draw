var ctx;
var can;
var canvasObj = new Canvas(1);
var canvas = document.querySelector("canvas");
var rect = canvas.getBoundingClientRect();
var present_page = 1;
var listen = false;
var pos = { x: 0, y: 0 }
var deleted = []
var did = false;
var undoTimes = 1
var undoStackLimit = 10;
setPageNo()
var eraser = document.getElementById("eraser")
var color = document.getElementById("color")
var size = document.getElementById("size")
var clear = document.getElementById("clear")
var tuner = document.getElementById("tuner")
var pointer = document.getElementById("pointer-circle")
var psvg = document.getElementById("pointer-svg")
var pup = document.getElementById("pup")
var pdn = document.getElementById("pdn")
var npg = document.getElementById("npg")
var dpg = document.getElementById("dpg")
var spg = document.getElementById("signpg")
var savepg = document.getElementById("savepg")
var getzip = document.getElementById("zip")
var undo = document.getElementById("undo")
var redo = document.getElementById("redo")
var up = document.getElementById("up")
var down = document.getElementById("bringDown")
var nav = document.getElementById("tools")
var button = document.getElementById("moreButton")
var tools = document.getElementById("tool-wrapper")
var eraserButton = document.getElementById("eraserButton");
var safeDrawElm = tools;
var ispressedShift = false;




eraserButton.addEventListener("click", () => {
    eraser.checked = eraser.checked ? false : true;
    eraserButton.style.backgroundColor = eraser.checked ? "#a9c0ff" : "#e9e9e9"
})

clear.addEventListener("click", clearCanvas);

document.addEventListener("mousedown", (event) => {
    pos.x = event.clientX - rect.left;
    pos.y = event.clientY - rect.top;
    if (safeDraw()) {
        draw(event)
        listen = true;
    }
    drawn()
})

document.addEventListener("mouseup", () => {
    listen = false;
})

psvg.addEventListener("mousemove", (event) => {
    if (listen && safeDraw()) {
        draw(event)
    }
    setPointer(event)
})

pup.addEventListener("click", page_up)
pdn.addEventListener("click", page_down)
npg.addEventListener("click", () => { newpage(false) })
spg.addEventListener("click", () => { newpage(true) })
dpg.addEventListener("click", deletePage)
savepg.addEventListener("click", () => { savePage(false) })
getzip.addEventListener("click", () => { savePage(true) })

// JS for CSS

button.addEventListener("click", () => {
    toolsMore = tools.getAttribute("more")
    if (toolsMore == "false") {
        for (let i = 0; i < document.getElementsByClassName("more").length; i++) {
            const element = document.getElementsByClassName("more")[i];
            element.style.display = "block";
        }
        tools.setAttribute("more", "true")
        document.getElementById("tools").style.height = "125px";
    } else {
        for (let i = 0; i < document.getElementsByClassName("more").length; i++) {
            const element = document.getElementsByClassName("more")[i];
            element.style.display = "none";
        }
        tools.setAttribute("more", "false")
        document.getElementById("tools").style.height = "80px";
    }
})

up.addEventListener("click", () => {
    nav.style.top = "-150px";
    down.style.display = "block";
    safeDrawElm = down;
})

down.addEventListener("click", () => {
    nav.style.top = "0px";
    down.style.display = "none";
    safeDrawElm = tools;
})