function clearCanvas() {
    c = canvas.getContext("2d")
    c.clearRect(0, 0, canvas.width, canvas.height)
    if (document.getElementById("page" + present_page).className.split(" ").length != 2) {
        can = document.getElementById("page" + present_page)
        ctx = can.getContext("2d")
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, can.width, can.height);
    }
}

function draw(event) {
    c = canvas.getContext("2d")
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    c.beginPath();
    sp = range(x, y, pos.x, pos.y);
    for (i in sp.x) {
        c.arc(sp.x[i], sp.y[i], size.value, 0, 2 * Math.PI);
    }
    c.fillStyle = !eraser.checked ? color.value : "white";
    c.fill();
    pos.x = x;
    pos.y = y;
}

function range(x1, y1, x2, y2) {
    if (tuner.value > 10000) {
        alert("This might hang your browser. Tune it to 10000 or below")
        tuner.value = 10000;
    }
    sp = { x: [], y: [] };
    for (i = 1; i <= tuner.value; i++) {
        sp.x.push(x1 + (i * (x2 - x1) / tuner.value));
        sp.y.push(y1 + (i * (y2 - y1) / tuner.value));
    }
    return sp
}

function setPointer(event) {
    x = event.clientX - size.value
    y = event.clientY - size.value
    if (x < canvas.clientWidth && y < canvas.clientHeight && safeDraw()) {
        psvg.style = `left:${x}px;top:${y}px;`
    }
    psvg.setAttribute("width", `${size.value * 2}px`)
    psvg.setAttribute("height", `${size.value * 2}px`)
    pointer.setAttribute("cx", `${size.value}px`)
    pointer.setAttribute("cy", `${size.value}px`)
    pointer.setAttribute("r", `${size.value}px`)
}

function page_up() {
    temp = present_page
    stable = present_page
    changed = true;
    do {
        present_page -= present_page > 1 ? 1 : 0
        if (present_page == temp) {
            present_page = stable
            changed = false
            break;
        }
        temp = present_page
    } while (document.getElementById("page" + present_page).className.split(" ")[0] == "dead");

    canvas = document.getElementById("page" + present_page);
    makeVisible(present_page)
    document.getElementById("page" + present_page).className.split(" ").length == 2 ? eraserOn(false) : eraserOn(true)
    setPageNo()
    return changed
}

function page_down() {
    temp = present_page
    stable = present_page
    changed = true
    do {
        present_page += present_page < canvasObj.page_no ? 1 : 0
        if (present_page == temp) {
            present_page = stable
            changed = false
            break;
        }
        temp = present_page
    } while (document.getElementById("page" + present_page).className.split(" ")[0] == "dead");

    canvas = document.getElementById("page" + present_page);
    makeVisible(present_page)
    document.getElementById("page" + present_page).className.split(" ").length == 2 ? eraserOn(false) : eraserOn(true)
    setPageNo()
    return changed
}

function newpage(sign = false) {
    canvasObj = new Canvas(canvasObj.page_no + 1, sign);
    canvas = document.getElementById("page" + canvasObj.page_no);
    makeVisible(canvasObj.page_no)
    present_page = canvasObj.page_no;
    sign ? eraserOn(false) : eraserOn(true)
    eraser.checked = sign ? false : eraser.checked;
    eraserButton.style.backgroundColor = !sign ? "#a9c0ff" : "#e9e9e9"
    eraserButton.style.backgroundColor = eraser.checked ? "#a9c0ff" : "#e9e9e9"
    setPageNo()
}

function eraserOn(e) {
    eraser.disabled = e ? false : true
}

function deletePage() {
    if (document.getElementsByClassName("alive").length > 1) {
        document.getElementById("page" + present_page).className.split(" ").length == 2 ? document.getElementById("page" + present_page).setAttribute("class", "dead sign") : document.getElementById("page" + present_page).setAttribute("class", "dead")
        localStorage.setItem("savedCanvas" + undoTimes, undoRequest(canvas,present_page,true))
        undoTimes += 1;
        if (!page_up()) {
            page_down()
        }
        setPageNo()
    } else {
        alert("Cannot delete page. Only one page left.")
    }
}

function savePage(all) {
    if (!all) {
        img = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
        download("S", img)
    } else {
        for (let i = 0; i < document.getElementsByClassName("alive").length; i++) {
            const element = document.getElementsByClassName("alive")[i];
            img = element.toDataURL("image/png").replace("image/png", "image/octet-stream")
            download(i + 1, img)
        }
    }
}

function download(num, imgage) {
    var a = document.createElement("a");
    a.href = imgage;
    a.download = `MrWhiteBoard_${num}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function makeVisible(elm_pg_no) {
    for (i = 0; i < document.getElementsByTagName("canvas").length; i++) {
        document.getElementsByTagName("canvas")[i].style.display = "none";
    }
    document.getElementById("page" + elm_pg_no).style.display = "block";
}

function setPageNo() {
    for (let i = 0; i < document.getElementsByClassName("alive").length; i++) {
        const element = document.getElementsByClassName("alive")[i];
        if (element.id == "page" + present_page) {
            document.getElementById("prepg").innerHTML = i + 1
        }
    }
    document.getElementById("totalpg").innerHTML = document.getElementsByClassName("alive").length;
}

function safeDraw() {
    navbar = safeDrawElm.getBoundingClientRect();
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    if ((x > navbar.left && x < navbar.right) && (y < navbar.bottom)) {
        return false;
    } else {
        return true;
    }
}

function undoRequest(canvas_2_save,canvas_no,isDeleted){
    return JSON.stringify({"canvasURL":canvas_2_save.toDataURL(),"canvasNum":canvas_no,"isDeleted":isDeleted})
}

function drawn() {
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    canRect = canvas.getBoundingClientRect()
    if (listen && x < canRect.right && y < canRect.bottom) {
        console.log("yes")
        if (undoTimes == undoStackLimit + 1) {
            reposition_undo()
            undoTimes = undoStackLimit - 1;
        }
        localStorage.setItem("savedCanvas" + undoTimes, undoRequest(canvas,present_page,false))
        undoTimes += 1;
    }
}

function reposition_undo() {
    localStorage.removeItem("savedCanvas1");
    for (i = 1; i < undoStackLimit; i++) {
        localStorage.setItem("savedCanvas" + i, localStorage.getItem("savedCanvas" + (i + 1)))
    }
    localStorage.removeItem("savedCanvas" + undoStackLimit);
}

function undoCanvas() {
    console.log(undoTimes);
    undoTimes = undoTimes > 1 ? undoTimes - 1 : 1
    dataURL = localStorage.getItem("savedCanvas" + undoTimes);
    dataURL = JSON.parse(dataURL)["canvasURL"];
    let img = new Image;
    img.src = dataURL;
    img.onload = function () {
        c.drawImage(img, 0, 0)
    }
}