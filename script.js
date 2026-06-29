// Date and Time
function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timeText = document.querySelector("#barDateAndTime");
  timeText.innerHTML = currentTime;
}
setInterval(updateTime, 1000);

// Window Functions
function dragElement(element) {

  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  if (document.getElementById(element.id + "Header")) {

    document.getElementById(element.id + "Header").onmousedown = startDragging;
  } else {
      element.onmousedown = startDragging;
    }


  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();

    if (element.style.transform !== "none" && element.style.transform !== "") {
      const rect = element.getBoundingClientRect();
      element.style.transform = "none";
      element.style.top = rect.top + "px";
      element.style.left = rect.left + "px";
    }

    initialX = e.clientX;
    initialY = e.clientY;

    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag;
  }


  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    const topBarHeight = document.querySelector("#topBar").offsetHeight;
    const minLeft = 0;
    const maxLeft = window.innerWidth - element.offsetWidth;
    const minTop = topBarHeight + 4;
    const maxTop = window.innerHeight - element.offsetHeight;

    const newTop = Math.min(Math.max(element.offsetTop - currentY, minTop), maxTop);
    const newLeft = Math.min(Math.max(element.offsetLeft - currentX, minLeft), maxLeft);

    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  } 
}

var selectedIcon = undefined;

function closeWindow(element) {
  element.style.display = "none";
}
function openWindow(element) {
  element.style.display = "block";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
  if(element.id === "notes") {
      setNotesContent(currentNoteIndex);
  }
}

function selectIcon(element) {
  if (selectedIcon) deselectIcon(selectedIcon);
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if(element){
    element.classList.remove("selected");
    selectedIcon = undefined
  }
}
document.addEventListener("mousedown", (e) => {
  if (!e.target.closest('.appDiv') && selectedIcon) {
    deselectIcon(selectedIcon);
  }
});
function handleIconTap(element) {
  selectIcon(element);
  
  var targetId = element.id.replace("Icon", ""); 
  var win = document.querySelector("#" + targetId);
  
  if (win) {
    openWindow(win);
  }
}
var topBar = document.querySelector("#topBar")
var biggestIndex = 1;
function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () =>
    handleWindowTap(element)
  )
}

function makeResizable(element) {
  const resizer = document.createElement('div');
  resizer.className = 'resizer';
  element.appendChild(resizer);

  resizer.addEventListener('mousedown', initResize, false);

  function initResize(e) {
    e.preventDefault();
    window.addEventListener('mousemove', resize, false);
    window.addEventListener('mouseup', stopResize, false);
  }

  function resize(e) {
    const newWidth = e.clientX - element.getBoundingClientRect().left;
    const newHeight = e.clientY - element.getBoundingClientRect().top;
    
    if (newWidth > 150) element.style.width = newWidth + 'px';
    if (newHeight > 100) element.style.height = newHeight + 'px';
  }

  function stopResize() {
    window.removeEventListener('mousemove', resize, false);
    window.removeEventListener('mouseup', stopResize, false);
  }
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
  deselectIcon(selectedIcon)
}
// All functions in one(heh!)
function initializeWindow(elementName) {
  var screen = document.querySelector("#" + elementName);
  if (!screen) return;


  dragElement(screen);
  addWindowTapHandling(screen);
  makeResizable(screen);

  var closeBtn = document.querySelector("#" + elementName + "Close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closeWindow(screen);
    });
  }

  var openBtn = document.querySelector("#" + elementName + "Icon");
  if (openBtn) {
    openBtn.addEventListener("click", function () {
      openWindow(screen);
    });
  }
}
initializeWindow("welcome");
initializeWindow("about");
initializeWindow("notes");
initializeWindow("wikipedia");
initializeWindow("music");
initializeWindow("terminal");

// Notes
var content = [
{
  title: "Welcome!",
  date: "25/06/2026",
  content: `
  <p contenteditable="true">Welcome to <strong>Cozy Notes</strong>
            </br>
            </br>
            <img src=""
              style="width: 96px; border-radius: 16px" />
            </br>
            This is a place where I store whatever comes to the mind. What exactly will you find when browsing through these notes? As I <ins>always say</ins>
        <blockquote
          style="background-color: #F9F9F9; margin-top: 16x; margin-bottom: 16px; margin-left: 0px; margin-right: 0px; padding: 16px; border-radius: 16px;"
          contenteditable="true">
          <i>Wisdom comes to anyone who stops seeking the world
            </br>
            ~ Sadiq
          </i>
        </blockquote>
        <div contenteditable="true">
          You may sometimes see my daily life here, sometimes just me arguing how Romcom animes are the best. Weather you agree with me or not that doesn't matter. What matters is <abbr title="A great Romcom">Kaguya Sama: Love is War.</abbr> 
        </div>
            </p>
            `
}]

var currentNoteIndex = 0;

const savedNotes = localStorage.getItem("notes");

if (savedNotes) {
    content = JSON.parse(savedNotes);
}

function setNotesContent(index) {
  saveCurrentNote();
    currentNoteIndex = index;
    document.querySelector("#noteTitleInput").value =
        content[index].title;
    document.querySelector("#notesContent").innerHTML =
        content[index].content;
}
function saveCurrentNote() {
  if(currentNoteIndex === null) return;
  const notesContent = document.querySelector("#notesContent");
    const titleInput = document.querySelector("#noteTitleInput");

    content[currentNoteIndex].content = notesContent.innerHTML;
    content[currentNoteIndex].title = titleInput.value;
    localStorage.setItem("notes", JSON.stringify(content));
    renderSidebar();
}
function renderSidebar() {
    const sidebar = document.querySelector("#notesSideBar");
    sidebar.innerHTML = "";

    content.forEach((note, index) => {
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("noteInSideBar");

        noteDiv.innerHTML = `
            <strong>${note.title}</strong><br>
            <small>${note.date}</small>
        `;

        noteDiv.onclick = () => setNotesContent(index);

        sidebar.appendChild(noteDiv);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar();
  currentNoteIndex = 0;
  document.querySelector("#noteTitleInput").value = content[0].title;
  document.querySelector("#notesContent").innerHTML = content[0].content;

    document.querySelector("#notesContent")
        .addEventListener("input", saveCurrentNote);

    document.querySelector("#noteTitleInput")
        .addEventListener("input", saveCurrentNote);
});

var addBtn = document.querySelector("#newNoteBtn");
addBtn.addEventListener("click", function() {
  // New Note
  var newNote = {
    title: "New Note",
    date: new Date().toLocaleDateString(),
    content: `<p contenteditable="true">This is a fresh note!</p>`
  };
  content.push(newNote);
  renderSidebar();
  setNotesContent(content.length - 1);
});


// Music Player and switcher
let currentSongIndex = 0;
var playlist = [
  { title: "City", file: "./music/City_Massobeats.mp3", image: "./images/city_cover.webp"},
  { title: "Gift", file: "./music/Gift_Massobeats.mp3", image: "./images/Gift_cover.webp"},
  { title: "Gingersweet", file: "./music/Gingersweet_Massobeats.mp3", image: "./images/gingersweet_cover.webp"},
  { title: "Honey Jam", file: "./music/Honey Jam_Massobeats.mp3", image: "./images/honey jam_cover.webp"},
  { title: "Peach Prosecco", file: "./music/Peach Prosecco_Massobeats.mp3", image: "./images/peach prosecco_cover.webp"},
  { title: "Rose Water", file: "./music/Rose Water_Massobeats.mp3", image: "./images/rose water_cover.webp"},
  { title: "Taro Swirl", file: "./music/Taro Swirl_Massobeats.mp3", image: "./images/taro swirl_cover.webp"},
];
var player = document.querySelector("#musicPlayer");
function playSong(index) {
  
  var artDisplay = document.querySelector("#albumArt");
  var song = playlist[index];
  currentSongIndex = index;
  artDisplay.src = song.image;
  player.src = song.file;
  player.load();
  player.play();
}
// For auto next song
player.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  playSong(currentSongIndex);
});

function populatePlaylist() {
  var container = document.querySelector("#musicContainer");
  var ul = document.createElement("ul");
  ul.style.listStyle = "none";
  ul.style.padding = "0";
  ul.style.width = "90%";
  playlist.forEach((song, index) => {
    var li = document.createElement("li");
    li.textContent = "▶ " + song.title;
    li.style.padding = "8px";
    li.style.cursor = "pointer";
    li.style.borderBottom = "1px solid burlywood";
    li.addEventListener("click", () => {
      playSong(index);
    });
    
    ul.appendChild(li);
  });
  container.appendChild(ul);
}
populatePlaylist();

// Terminal Window
const terminalInput = document.querySelector("#terminalInput");
const terminalOutput = document.querySelector("#terminalOutput");

terminalInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    const command = terminalInput.value.trim();
    terminalOutput.innerHTML += `<div>user@simpos:~$ ${command}</div>`;
    
    if (command === "help") {
      terminalOutput.innerHTML += `<div style="white-space: pre-wrap;">Available Commands:
help
version
clear
about
whoami</div>`;
    } else if (command === "clear") {
      terminalOutput.innerHTML = "";
    } else if (command === "version") {
      terminalOutput.innerHTML += `<div>SimpOS v1.0 - Built by Sadiq</div>`;
    } else if (command === "whoami") {
      terminalOutput.innerHTML += `<div>User1</div>`;
    } else if (command === "about") {
      terminalOutput.innerHTML += `<div>A self-taught aspiring web developer from India!</div>`;
    } else {
      terminalOutput.innerHTML += `<div>Command not found: ${command}</div>`;
    }
    
    terminalInput.value = "";
    terminalOutput.scrollIntoView({ behavior: "smooth", block: "end" });
  }
});