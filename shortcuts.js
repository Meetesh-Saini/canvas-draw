document.body.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "ArrowDown":
            page_down()
            break;
        case "ArrowUp":
            page_up()
            break;
        case "KeyN":
            newpage(false)
            break;
        case "KeyT":
            newpage(true)
            break;
        case "Delete":
            deletePage()
            break;
        case "Backspace":
            clearCanvas();
            break;
        case "ShiftLeft":
        case "ShiftRight":
            ispressedShift = true;
            break;
        case "KeyS":
            if (ispressedShift) {
                savePage(false)
            }
            break;
        case "KeyA":
            if (ispressedShift) {
                savePage(true)
            }
            break;
        case "KeyE":
            eraser.checked = document.getElementById("page" + present_page).className.split(" ").length != 2 ? !eraser.checked : false;
            eraserButton.style.backgroundColor = eraser.checked ? "#a9c0ff" : "#e9e9e9"
            break;
        case "KeyZ":
            if (ispressedShift) {
                undoCanvas()
            }
            break;
    }
    // console.log(e.code);
})
document.body.addEventListener("keyup", (e) => {
    if (e.code == "ShiftLeft" || e.code == "ShiftRight") {
        ispressedShift = false;
    }
})