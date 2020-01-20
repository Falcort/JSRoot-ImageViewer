const LENS_BORDER_SIZE = 1; // The border size of the lens that move with the cursor
const ZOOM_BORDER_SIZE = 1; // The border size of the resulted zoom area
const LENGTH_MIN_SIZE = 20; // The min size of the lens
const ZOOM_FACTOR = 7; // This value is the biggest value of the length or width divided by this, in order to always have a % of the picture for the result zoom size
const ZOOM_LENGTH_FACTOR = 5; // At which speed the lens will grow on scrolling, each scroll event it will be this var bigger (in pixels)
const ZOOM_SIZE = {};

const DIV = {}; // The main div, initialized at first !
const IS_ZOOM = {}; // If the zoom is enabled for the picture;


/**
 * Main function of the script
 * This take two parameters, one is the SRC of the picture, it can be an directory or a Base64 code or whatever the <img> can take
 *
 * @param src -- normal <img> src
 * @param divid -- The ID where to dray the picture
 */
function drawImage(src, divid) {
   DIV[divid] = document.getElementById(divid);
   IS_ZOOM[divid] = false;
   createLens(divid);
   const image = document.createElement("img");
   image.id = divid + 'Image';
   image.src = src;
   image.style.maxWidth = '100%';
   image.style.maxHeight = '100%';
   document.getElementById(divid).appendChild(image);
   createZoom(divid);

   window.addEventListener('load', function() {
      imageZoom(divid);
      createControls(divid);
   });
}

/**
 * This function will create the lens that move with the cursor
 *
 * @param masterID -- The ID of the main element
 * @returns {HTMLDivElement} -- Return the lens if needed
 */
function createLens(masterID) {
   const lens = document.createElement('div');
   lens.id = masterID + 'Lens';
   const style = lens.style;

   style.position = 'absolute';
   style.border = `${LENS_BORDER_SIZE}px solid rgb(0, 126, 255)`;
   style.backgroundColor = 'rgba(0, 126, 255, .2)';
   style.display = 'none';
   style.cursor = 'move';

   //Append the child into the master DIV
   //DIV[masterID].appendChild(lens); TODO: This should work but then need to redo all the maths of positions
   document.body.appendChild(lens);
   return lens;
}

/**
 * This function will create the zoomed area
 *
 * @param masterID -- The ID of the main element
 * @returns {HTMLDivElement} -- Return the zoomed area if needed
 */
function createZoom(masterID) {
   const zoom = document.createElement('div');
   zoom.id = masterID + 'Zoom';

   const style = zoom.style;

   style.border = `${ZOOM_BORDER_SIZE}px solid #f1f1f1`;
   style.display = 'inline-block';
   style.backgroundRepeat = 'no-repeat';
   style.position = 'absolute';
   style.transition = 'top .3s, left .3s';
   style.background = 'white';

   //Append the child into the master DIV
   // DIV[masterID].appendChild(zoom); TODO: This should work but then need to redo all the maths of positions
   document.body.appendChild(zoom);
   return zoom;
}

/**
 * This function create the controls for the script.
 * For now only the zoom is created, but this is here if you wan to add others option like rotate controls
 * There is no return because the controls are not only one
 *
 * @param masterID -- The ID of the main element
 */
function createControls(masterID) {
   const controls = document.createElement('div');
   controls.id = masterID + 'Controls';

   //Append the child into the master DIV
   DIV[masterID].appendChild(controls);

   //Zoom SVG
   let zoomSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
   zoomSVG.setAttributeNS(null, 'viewBox', '0 0 15.99 16');
   zoomSVG.style.margin = 10 + 'px';
   zoomSVG.style.objectFit ='contain';
   zoomSVG.style.width = '16px';
   zoomSVG.style.cursor = 'pointer';
   zoomSVG.style.height = '16px';
   zoomSVG.style.opacity = '0.3';
   zoomSVG.style.fill = 'steelblue';
   zoomSVG.id = masterID + 'ZoomButton';
   controls.appendChild(zoomSVG);

   let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
   path.setAttributeNS(null, 'd','M15.5,13.12L13.19,10.8a1.69,1.69,0,0,0-1.28-.55l-0.06-.06A6.5,6.5,0,0,0,5.77,0,6.5,6.5,0,0,0,2.46,11.59a6.47,6.47,0,0,0,7.74.26l0.05,0.05a1.65,1.65,0,0,0,.5,1.24l2.38,2.38A1.68,1.68,0,0,0,15.5,13.12ZM6.4,2A4.41,4.41,0,1,1,2,6.4,4.43,4.43,0,0,1,6.4,2Z');
   path.setAttributeNS(null, 'transforrm','translate(-.01)');
   path.setAttributeNS(null, 'x','0');
   path.setAttributeNS(null, 'y','0');
   path.setAttributeNS(null, 'height','14');
   path.setAttributeNS(null, 'width','14');
   zoomSVG.appendChild(path);
   controls.appendChild(zoomSVG);

   // Listener to enable/disable the zoom
   zoomSVG.addEventListener('click', () => {
      IS_ZOOM[masterID] = !IS_ZOOM[masterID];

      if(IS_ZOOM[masterID]) {
         document.getElementById(masterID+ 'Zoom').style.display = 'inline-block';
         document.getElementById(masterID+ 'Lens').style.display = 'initial';

         zoomSVG.style.opacity = '1';
      } else {
         document.getElementById(masterID+ 'Zoom').style.display = 'none';
         document.getElementById(masterID+ 'Lens').style.display = 'none';

         zoomSVG.style.opacity = '0.3';
      }
   });

   let zoomMinus = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
   zoomMinus.setAttributeNS(null, 'viewBox', '0 0 170 35');
   zoomMinus.style.margin = 10 + 'px';
   zoomMinus.style.objectFit ='contain';
   zoomMinus.style.width = '16px';
   zoomMinus.style.cursor = 'pointer';
   zoomMinus.style.height = '16px';
   zoomMinus.style.opacity = '0.3';
   zoomMinus.style.fill = 'steelblue';
   zoomMinus.id = masterID + 'ZoomMinusButton';
   controls.appendChild(zoomMinus);

   let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
   rect.setAttributeNS(null, 'width', 170);
   rect.setAttributeNS(null, 'height', 35);
   zoomMinus.append(rect);

   zoomMinus.addEventListener('click', () => {
      const zoom = document.getElementById(masterID + 'Zoom');
      let zoomLength = zoom.offsetWidth - ZOOM_BORDER_SIZE*2;

      zoomLength -= 10;
      ZOOM_SIZE[masterID] -= 10;

      zoom.style.width = zoomLength + 'px';
      zoom.style.height = zoomLength + 'px';
   });

   let zoomPlus = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
   zoomPlus.setAttributeNS(null, 'viewBox', '0 0 170 35');
   zoomPlus.style.margin = 10 + 'px';
   zoomPlus.style.objectFit ='contain';
   zoomPlus.style.width = '16px';
   zoomPlus.style.cursor = 'pointer';
   zoomPlus.style.height = '16px';
   zoomPlus.style.opacity = '0.3';
   zoomPlus.style.fill = 'steelblue';
   zoomPlus.id = masterID + 'ZoomPlusButton';
   controls.appendChild(zoomPlus);

   rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
   rect.setAttributeNS(null, 'width', 170);
   rect.setAttributeNS(null, 'height', 35);
   zoomPlus.append(rect);

   rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
   rect.setAttributeNS(null, 'width', '170');
   rect.setAttributeNS(null, 'height', 35);
   rect.setAttributeNS(null, 'transform', 'translate(105 -60) rotate(90)');
   zoomPlus.append(rect);

   zoomPlus.addEventListener('click', () => {
      console.log('HERE');
      const zoom = document.getElementById(masterID + 'Zoom');
      let zoomLength = zoom.offsetWidth - ZOOM_BORDER_SIZE*2;

      zoomLength += 10;
      ZOOM_SIZE[masterID] += 10;

      zoom.style.width = zoomLength + 'px';
      zoom.style.height = zoomLength + 'px';

   });

   // Append the button to the controls div which is appended into the master DIV
}

/**
 * Main function of the script
 * This mainly add the events listeners to the created components
 *
 * @param masterID -- The ID of the main element
 */
function imageZoom(masterID) {
   const img = document.getElementById(masterID + 'Image');
   const zoom = document.getElementById(masterID + 'Zoom');
   const lens = document.getElementById(masterID + 'Lens');

   zoom.style.backgroundImage = "url('" + img.src + "')";


   // Events listeners
   lens.addEventListener("mousemove", moveLens);
   img.addEventListener("mousemove", moveLens);
   lens.addEventListener('wheel', zoomFactor);

   /**
    * This function move the lens with your cursor
    *
    * @param e -- The mouse event
    */
   function moveLens(e) {

      if(IS_ZOOM[masterID]) {

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
   }

   /**
    * This function change the position of the Zoom result not to block the view
    *
    * @param e -- The mouse event
    */
   function moveZoom(e) {

      if(IS_ZOOM[masterID]) {

         //Set of the zoom place
         const scrolledY = window.scrollY;
         let length = Math.max(img.width, img.height)/ZOOM_LENGTH_FACTOR;
         if(ZOOM_SIZE[masterID] !== undefined) {
            length += ZOOM_SIZE[masterID];
         }

         zoom.style.height = length + 'px';
         zoom.style.width = length + 'px';

         //Set the size of the lens at the size of the zoom on first start
         if(lens.style.height === '' && lens.style.width === '') {
            lens.style.height = length + 'px';
            lens.style.width = length + 'px';
         }

         if(e && e.screenX !== undefined) {

            //Left or Right
            if(e.clientX >= imagePosition.x && e.clientX <= imagePosition.x + imagePosition.width/2) {
               zoom.style.left = (img.offsetWidth - length + imagePosition.x - ZOOM_BORDER_SIZE*2) + 'px';
            } else {
               zoom.style.left = imagePosition.x + 'px';
            }

            // Top or Bottom
            if(e.clientY >= imagePosition.y && e.clientY <= imagePosition.y + imagePosition.height/2) {
               zoom.style.top = imagePosition.bottom - length + scrolledY + 'px';
            } else {
               zoom.style.top = imagePosition.y + scrolledY + 'px';
            }
         }

      }
   }

   /**
    * This function will change the size of the lens, and change the background position of the zoom result
    *
    * @param e -- The scroll wheel event
    */
   function zoomFactor(e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      if(IS_ZOOM[masterID]) {

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

         // Max the zoom factor to zoom result size
         if(resultWidth > zoom.offsetWidth - ZOOM_BORDER_SIZE*2) {
            resultWidth = zoom.offsetWidth
         }
         if(resultHeight > zoom.offsetHeight - ZOOM_BORDER_SIZE*2) {
            resultHeight = zoom.offsetHeight
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
}
