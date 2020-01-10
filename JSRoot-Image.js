const LENS_BORDER_SIZE = 1;

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

   style.border = '1px solid #f1f1f1';
   style.width = '300px';
   style.height = '300px';
   style.display = 'inline-block';
   style.backgroundRepeat = 'no-repeat';
   style.opacity = '0';

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

   zoom.style.backgroundImage = "url('" + img.src + "')";

   // // Un-display the zoom if the cursor is not on the image
   lens.addEventListener('mouseout', () => {
      zoom.style.display = 'none';
      zoom.style.opacity = '0';
   });

   // Display the zoom if the cusror is on the image
   img.addEventListener('mousemove', () => {
      zoom.style.display = 'inline-block';
      zoom.style.opacity = '1';
   });

   // Events listeners
   lens.addEventListener("mousemove", moveLens);
   img.addEventListener("mousemove", moveLens);

   lens.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const height = Number(lens.style.height.slice(0, -2));
      const width = Number(lens.style.width.slice(0, -2));

      const factor = 2;



      //Zoom direction
      if(e.deltaY > 0) {
         lens.style.width = (width - factor) + 'px';
         lens.style.height = (height - factor) +'px';
      }
      if(e.deltaY < 0) {
         lens.style.width = (width + factor) + 'px';
         lens.style.height = (height + factor) +'px';
      }

      // Prevent zooming bigger than the picture
      if(lens.offsetHeight > img.offsetHeight) {
         lens.style.height = (img.offsetHeight - LENS_BORDER_SIZE*2) + 'px';
      }
      if(lens.offsetWidth > img.offsetWidth) {
         lens.style.width = (img.offsetWidth - LENS_BORDER_SIZE*2) + 'px';
      }
   });

   function moveLens(e) {
      e.preventDefault();

      const imagePosition = img.getBoundingClientRect();
      const cursorX = e.clientX;
      const cursorY = e.clientY;
      const scrolledX = window.scrollX;
      const scrolledY = window.scrollY;
      let posZoomX;
      let posZoomY;

      // length of the zoom divided by the length od the lens
      // 302 / 42 = 7.19
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
}
