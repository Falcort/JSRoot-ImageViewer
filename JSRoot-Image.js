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
   style.border = '1px solid rgb(0, 126, 255)';
   style.backgroundColor = 'rgba(0, 126, 255, .2)';
   style.width = '40px';
   style.height = '40px';

   //TO BE REMOVED IF FIXED
   // style.opacity = '0';

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
   const imagePosition = img.getBoundingClientRect();
   const zoom = document.getElementById(imgID + 'Zoom');
   const lens = document.getElementById(imgID + 'Lens');

   // length of the zoom divided by the length od the lens
   // 302 / 42 = 7.19
   let cx = zoom.offsetWidth / lens.offsetWidth;
   let cy = zoom.offsetHeight / lens.offsetHeight;

   zoom.style.backgroundImage = "url('" + img.src + "')";

   // 7.19 * 500 = 3595
   // Image size multiplied bya the offset
   zoom.style.backgroundSize = (imagePosition.width * cx) + "px " + (imagePosition.height * cy) + "px";

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

   function moveLens(e) {
      e.preventDefault();

      const cursorX = e.clientX;
      const cursorY = e.clientY;
      const scrolledX = window.scrollX;
      const scrolledY = window.scrollY;
      let posZoomX;
      let posZoomY;
      console.log('-------');

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
      if (cursorY - (lens.offsetWidth/2) < imagePosition.top) {
         lens.style.top = (imagePosition.top + scrolledY ) + 'px';
         posZoomY = imagePosition.top + scrolledY;
      }

      // If cursor is on bottom
      if(cursorY + (lens.offsetWidth/2) > imagePosition.bottom) {
         lens.style.top = (imagePosition.bottom + scrolledY - lens.offsetHeight) + 'px';
         posZoomY = imagePosition.bottom + scrolledY - lens.offsetHeight;
      }

      console.log('X', posZoomX, lens.style.left);
      console.log('Y', posZoomY, lens.style.top);
      console.log(imagePosition);

      zoom.style.backgroundPosition = `-${(posZoomX - imagePosition.x) * cx}px -${(posZoomY - imagePosition.y) * cy }px`;

      // // Location of the cusor - siz of the lens / 2
      // // Upper left location of the lens
      // let x = cursorPos.x - (lens.offsetWidth / 2);
      // let y = cursorPos.y - (lens.offsetHeight / 2);
      //
      // console.log('------------------');
      // console.log('y=', y);
      // console.log('pos=', img.height - imagePosition.top + lens.offsetHeight);
      // console.log(imagePosition);
      //
      // // Boundaries of Pic
      // if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
      // if (x < 0) {x = 0;}
      // if (y > img.height - imagePosition.top + lens.offsetHeight) {y = imagePosition.height - imagePosition.top + lens.offsetHeight;}
      // if (y < 0) {y = 0;}
      //
      // // Move the lens
      // lens.style.left = (x + imagePosition.x) + "px";
      // lens.style.top = (y + imagePosition.y) + "px";
      //
      // // Move the zoom
      // zoom.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
   }

   function getCursorPos(event) {
      const imagePosition = img.getBoundingClientRect();
      let x = event.pageX - imagePosition.left;
      let y = event.pageY - imagePosition.top;
      return {x : x, y : y};
   }
}
