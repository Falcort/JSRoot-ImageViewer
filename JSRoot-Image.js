const LENS_BORDER_SIZE = 1;
const ZOOM_BORDER_SIZE = 1;
const LENGTH_MIN_SIZE = 20;
const ZOOM_FACTOR = 7;
const ZOOM_LENGTH_FACTOR = 5;

function drawImageFromFile(file) {

   const id = makeID(10);

   createLens(id);

   const image = document.createElement("img");
   image.id = id;
   image.src = file;
   image.style.maxWidth = '100%';
   image.style.maxHeight = '100%';
   document.body.appendChild(image);

   createZoom(id);

   window.addEventListener('load', function() {
      imageZoom(id);
   });
}

function drawImageFromBase64(data) {
   const id = makeID(10);

   createLens(id);

   const image = document.createElement("img");
   image.id = id;
   image.style.maxWidth = '100%';
   image.style.maxHeight = '100%';
   image.src = 'data:image/png;base64,' + data;
   document.body.appendChild(image);

   createZoom(id);

   window.addEventListener('load', function() {
      imageZoom(id);
   });
}

function createLens(masterID) {
   const lens = document.createElement('div');
   lens.id = masterID + 'Lens';
   const style = lens.style;

   style.position = 'absolute';
   style.border = `${LENS_BORDER_SIZE}px solid rgb(0, 126, 255)`;
   style.backgroundColor = 'rgba(0, 126, 255, .2)';
   style.width = '40px';
   style.height = '40px';

   document.body.appendChild(lens);
   return lens;
}

function createZoom(masterID) {
   const zoom = document.createElement('div');
   zoom.id = masterID + 'Zoom';

   const style = zoom.style;

   style.border = `${ZOOM_BORDER_SIZE}px solid #f1f1f1`;
   style.display = 'inline-block';
   style.backgroundRepeat = 'no-repeat';
   style.position = 'absolute';

   document.body.appendChild(zoom);
   return zoom;
}


function makeID(length) {
   let result = '';
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


function imageZoom(imgID) {
   const img = document.getElementById(imgID);
   const zoom = document.getElementById(imgID + 'Zoom');
   const lens = document.getElementById(imgID + 'Lens');

   let cursorOnPicture = false;
   let cursorOnLens = false;

   zoom.style.backgroundImage = "url('" + img.src + "')";


   img.addEventListener('mouseenter', () => {
      cursorOnPicture = true;

      zoom.style.display = 'inline-block';
      lens.style.display = 'initial';
   });

   img.addEventListener('mouseleave', () => {
      cursorOnPicture = false;
   });

   lens.addEventListener('mouseenter', () => {
      cursorOnLens = true;
   });

   lens.addEventListener('mouseleave', () => {
      cursorOnLens = false;

      if(!(cursorOnLens && cursorOnPicture)) {
         zoom.style.display = 'none';
         lens.style.display = 'none';
      }
   });

   // Events listeners
   lens.addEventListener("mousemove", moveLens);
   img.addEventListener("mousemove", moveLens);

   lens.addEventListener('wheel', zoomFactor);

   function moveLens(e) {
      if(e) {
         e.preventDefault();
         cursorX = e.clientX;
         cursorY = e.clientY;
      }

      imagePosition = img.getBoundingClientRect();
      let scrolledX = window.scrollX;
      let scrolledY = window.scrollY;
      let posZoomX;
      let posZoomY;

      moveZoom(e);

      // length of the zoom divided by the length od the lens
      let cx = zoom.offsetWidth / lens.offsetWidth;
      let cy = zoom.offsetHeight / lens.offsetHeight;

      // 7.19 * 500 = 3595
      // Image size multiplied bya the offset
      zoom.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

      //MOVE OF THE LENS
      lens.style.top = (cursorY  + scrolledY - (lens.offsetHeight/2)) + 'px';
      lens.style.left = (cursorX - scrolledX - (lens.offsetWidth/2)) + 'px';
      posZoomY = cursorY  + scrolledY - (lens.offsetHeight/2);
      posZoomX = cursorX - scrolledX - (lens.offsetWidth/2);

      //If cursor is on the left
      if(cursorX - (lens.offsetWidth/2) < imagePosition.left) {
         lens.style.left = imagePosition.left + 'px';
         posZoomX = imagePosition.left;
      }
      // If cursor is on right
      if (cursorX + (lens.offsetWidth/2) > imagePosition.right) {
         lens.style.left = (imagePosition.right - lens.offsetWidth) + 'px';
         posZoomX = imagePosition.right - lens.offsetWidth;
      }

      // If cursor is on the top
      if (cursorY - (lens.offsetHeight/2) < imagePosition.top) {
         lens.style.top = (imagePosition.top + scrolledY ) + 'px';
         posZoomY = imagePosition.top + scrolledY;
      }

      // If cursor is on bottom
      if(cursorY + (lens.offsetHeight/2) > imagePosition.bottom) {
         lens.style.top = (imagePosition.bottom + scrolledY - lens.offsetHeight) + 'px';
         posZoomY = imagePosition.bottom + scrolledY - lens.offsetHeight;
      }

      zoom.style.backgroundPosition = `-${(posZoomX - imagePosition.x - scrolledX) * cx}px -${(posZoomY - imagePosition.y - scrolledY) * cy }px`;
   }

   function moveZoom(e) {
      //Set of the zoom place
      const length = Math.max(img.width, img.height)/ZOOM_LENGTH_FACTOR;
      zoom.style.height = length + 'px';
      zoom.style.width = length + 'px';
      zoom.style.top = imagePosition.y + 'px';

      if(e && e.screenX !== undefined) {
         if(e.screenX >= imagePosition.x && e.screenX <= imagePosition.x + length + lens.offsetWidth/2) {
            zoom.style.left = (img.offsetWidth - length + imagePosition.x - ZOOM_BORDER_SIZE*2) + 'px'; // Right
         } else {
            zoom.style.left = imagePosition.x + 'px'; // Left
         }
      }
   }

   function zoomFactor(e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      imagePosition = img.getBoundingClientRect();
      const height = Number(lens.style.height.slice(0, -2));
      const width = Number(lens.style.width.slice(0, -2));

      let resultWidth;
      let resultHeight;

      //Zoom direction
      if(e.deltaY > 0) {
         resultWidth = (width - ZOOM_FACTOR);
         resultHeight = (height - ZOOM_FACTOR);
      }
      if(e.deltaY < 0) {
         resultWidth = (width + ZOOM_FACTOR);
         resultHeight = (height + ZOOM_FACTOR);
      }

      // Force minimum size
      if(resultWidth < LENGTH_MIN_SIZE) {
         resultWidth = LENGTH_MIN_SIZE;
      }
      if(resultHeight < LENGTH_MIN_SIZE) {
         resultHeight = LENGTH_MIN_SIZE;
      }

      // Prevent zooming bigger than the picture
      if(resultHeight > img.offsetHeight - LENS_BORDER_SIZE*2) {
         resultHeight = (img.offsetHeight - LENS_BORDER_SIZE*2);

         //Keep the lens square
         resultWidth = (img.offsetHeight - LENS_BORDER_SIZE*2);
      }
      if(resultWidth > img.offsetWidth - LENS_BORDER_SIZE*2) {
         resultWidth = (img.offsetWidth - LENS_BORDER_SIZE*2);

         //Kep the lens square
         resultHeight = (img.offsetWidth - LENS_BORDER_SIZE*2);
      }

      lens.style.width = resultWidth + 'px';
      lens.style.height = resultHeight + 'px';

      moveLens();
   }
}
