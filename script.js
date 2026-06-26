function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timeText = document.querySelector("#barDateAndTime");
  timeText.innerHTML = currentTime;
}
setInterval(updateTime, 1000);

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "Header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "Header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = element.offsetTop - currentY + "px";
    element.style.left = element.offsetLeft - currentX + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
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
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
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
  
  // Logic: if element is #aboutIcon, open #about
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

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
  deselectIcon(selectedIcon)
}
function initializeWindow(elementName) {
  var screen = document.querySelector("#" + elementName);
  if (!screen) return; // Safety check to ensure element exists


  dragElement(screen);  // Make Draggable
  addWindowTapHandling(screen);  // bring to top

  // Make closable (needs ID: elementName + "Close")
  var closeBtn = document.querySelector("#" + elementName + "Close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closeWindow(screen);
    });
  }

  // Make openable (needs ID: elementName + "Icon")
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

// notes
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
}
]
function setNotesContent(index) {
  var notesContent = document.querySelector("#notesContent")
  notesContent.innerHTML = content[index].content
}
setNotesContent(0)

function addToSideBar(index) {
  var sideBar = document.querySelector("#notesSideBar");
  var note = content[index];
  var newDiv = document.createElement("div");
  newDiv.innerHTML = `
  <p style="margin: 0px;">
      ${note.title}
    </p>
    <p style="font-size: 12px; margin: 0px;">
      ${note.date}
    </p>
    `
  newDiv.addEventListener("click", function() {
    setNotesContent(index);
  });
  sideBar.appendChild(newDiv);
}

for (let i = 0; i < content.length; i++) {
addToSideBar(i)
}
setNotesContent(0);

var addBtn = document.querySelector("#newNoteBtn");
addBtn.addEventListener("click", function() {
  // new note
  var newNote = {
    title: "New Note",
    date: "06/25/2026",
    content: `<p contenteditable="true">This is a fresh note!</p>`
  };
  content.push(newNote);

  var sidebar = document.querySelector("#notesSideBar");
  sidebar.innerHTML = "";
  for (let i = 0; i < content.length; i++) {
    addToSideBar(i);
  }
});

// Music Player and switcher
var playlist = [
  { title: "City", file: "./music/City_Massobeats.mp3", image: "./images/city_cover.webp"},
  { title: "Gift", file: "./music/Gift_Massobeats.mp3", image: "./images/Gift_cover.webp"},
  { title: "Gingersweet", file: "./music/Gingersweet_Massobeats.mp3", image: "./images/gingersweet_cover.webp"},
  { title: "Honey Jam", file: "./music/Honey Jam_Massobeats.mp3", image: "./images/honey jam_cover.webp"},
  { title: "Peach Prosecco", file: "./music/Peach Prosecco_Massobeats.mp3", image: "./images/peach prosecco_cover.webp"},
  { title: "Rose Water", file: "./music/Rose Water_Massobeats.mp3", image: "./images/rose water_cover.webp"},
  { title: "Taro Swirl", file: "./music/Taro Swirl_Massobeats.mp3", image: "./images/taro swirl_cover.webp"},
];

function playSong(index) {
  var player = document.querySelector("#musicPlayer");
  var artDisplay = document.querySelector("#albumArt");
  var song = playlist[index];
  artDisplay.src = song.image;
  player.load();
  player.play();
}
function populatePlaylist() {
  var container = document.querySelector("#musicContainer");
  var ul = document.createElement("ul");
  ul.style.listStyle = "none";
  ul.style.padding = "0";
  ul.style.width = "90%"
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