const canvas = document.getElementById("signature-pad");
const clearBtn = document.getElementById("clear-btn");
const saveBtn = document.getElementById("save-btn");
const context = canvas.getContext("2d");
let display = document.getElementById("show");
let painting = false;

function startPosition(e) {
  painting = true;
  draw(e);
}

function finishedPosition() {
  painting = false;
  context.beginPath();  // Reset the path to avoid lines connecting new strokes
}

function draw(e) {
  if (!painting) return;

  let clientX, clientY;
  if (e.type.startsWith("touch")) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const x = clientX - canvas.offsetLeft;
  const y = clientY - canvas.offsetTop;

  context.lineWidth = 2;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = "black";

  context.lineTo(x, y);
  context.stroke();
  context.beginPath();  // Begin a new path after each stroke
  context.moveTo(x, y); // Move the starting point of the next line to the current pointer location
}

// Event listeners for mouse
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", finishedPosition);
canvas.addEventListener("mousemove", draw);

// Event listeners for touch
canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", finishedPosition);
canvas.addEventListener("touchmove", draw);

// Clear canvas
clearBtn.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  display.innerHTML = "";
});

// Save and download the signature
saveBtn.addEventListener("click", () => {
  const dataURL = canvas.toDataURL();  // Convert canvas to data URL (base64)
  if (dataURL) {
    // Create an image element to display the signature
    let img = document.createElement("img");
    img.setAttribute("class", "signature-img");
    img.src = dataURL;

    // Create a download link
    let downloadLink = document.createElement("a");
    downloadLink.href = dataURL;
    downloadLink.download = "signature.png";  // Specify the download file name

    // Append the image and the download link to the display area
    downloadLink.innerHTML = "Download Signature";
    display.innerHTML = "";  // Clear previous content
    display.appendChild(img);
    display.appendChild(downloadLink);
  } else {
    display.innerHTML = "<span class='error'>Please sign before saving</span>";
  }
});
