import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class App extends React.Component {
  randomString = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  componentDidMount() {
    firebase.initializeApp({
      apiKey: "AIzaSyBKSkszLrjQRuN2fOSRiIawNcbowVN8MoY",
      authDomain: "thebestartapp.firebaseapp.com",
      databaseURL: "https://thebestartapp.firebaseio.com",
      projectId: "thebestartapp",
      storageBucket: "thebestartapp.appspot.com",
      messagingSenderId: "484466280527"
    });

    var canvas = document.getElementById('canvas');
    var c = canvas.getContext('2d');
    var mouseDown = false;
    var colour = 'black';
    var toolSize = 1;
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);

    firebase.database().ref('fileNames').orderByChild('fileName').on('value', fileNamesData => {
      // make a new empty array
      var fileNamesArray = [];
      // loop though the data returned from firebase and convert it into a more simple array
      fileNamesData.forEach(function(fileNameData) {
        fileNamesArray.push({ fileName: fileNameData.val().fileName });
      });
      // clear the element before loading in new stuff.
      $('.artGalleryContainer').empty();
      var imgElementsArray = [];
      // loop through the array and create an element for each one then append the element
      fileNamesArray.map(function(fileName) {
        firebase.storage().ref('art/' + fileName.fileName).getDownloadURL().then(function(url) {
          var borderColour = fileName.fileName.substr(fileName.fileName.length - 6, 6);
          var imgElement = $(`<img src="${url}" alt="" class="art" style="border: 10px ridge #${borderColour}"/>`);
          imgElementsArray.push({element: imgElement, fileName: fileName.fileName});
          if (fileNamesArray.length === imgElementsArray.length) {
            var sortedImgElementsArray = imgElementsArray.sort(function(a, b) {
              var one = a.fileName.substr(0, 13);
              var two = b.fileName.substr(0, 13);
              return two - one;
            });
            sortedImgElementsArray.map(function(imgElement) {
              $('.artGalleryContainer').append(imgElement.element);
            });
          }
        });
      });
    });

    $('.submitButton').click(() => {
      // generate file name based on time and a random number for good measure
      var id = new Date().getTime() + '-' + this.randomString() + this.randomString();
      // get the image from the canvas as a blob and upload it to firebase
      canvas.toBlob(function(blob) {
        firebase.storage().ref('art/' + id).put(blob).then(function() {
          // store a reference to the file name in the database so we can retrieve the images elsewhere
          firebase.database().ref('fileNames/' + id).set({ fileName: id });
        });
      });
      // clear the canvas
      c.fillRect(0, 0, canvas.width, canvas.height);
    });

    $('.small').click(function() {
      toolSize = 1;
      $('.toolSizes > *').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.medium').click(function() {
      toolSize = 5;
      $('.toolSizes > *').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.large').click(function() {
      toolSize = 9;
      $('.toolSizes > *').removeClass('selected');
      $(this).addClass('selected');
    });

    $('.red').click(function() {
      colour = 'red';
      $('.colours > *').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.blue').click(function() {
      colour = 'blue';
      $('.colours > *').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.yellow').click(function() {
      colour = 'yellow';
      $('.colours > *').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.green').click(function() {
      colour = 'green';
      $('.colours > *').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.orange').click(function() {
      colour = 'orange';
      $('.colours > *').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.purple').click(function() {
      colour = 'purple';
      $('.colours > *').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.white').click(function() {
      colour = 'white';
      $('.colours > *').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.black').click(function() {
      colour = 'black';
      $('.colours > *').removeClass('selected');
      $(this).addClass('selected');
    });

    $('#canvas').on('mousedown', function(e) {
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;
      mouseDown = true;
      c.strokeStyle = colour;
      c.lineWidth = toolSize;
      c.beginPath();
      c.moveTo(mouseX, mouseY);
    });
    $('#canvas').on('touchstart', function(e) {
      var pageX = e.originalEvent.touches[0].pageX;
      var pageY = e.originalEvent.touches[0].pageY;
      var mouseX = pageX - this.offsetLeft;
      var mouseY = pageY - this.offsetTop;
      mouseDown = true;
      c.strokeStyle = colour;
      c.lineWidth = toolSize;
      c.beginPath();
      c.moveTo(mouseX, mouseY);
    });

    $('#canvas').on('mouseup', function() {
      mouseDown = false;
    });
    $('#canvas').on('touchend', function() {
      mouseDown = false;
    });

    $('#canvas').on('mouseleave', function() {
      mouseDown = false;
    });
    $('#canvas').on('touchcancel', function() {
      mouseDown = false;
    });

    $('#canvas').on('mousemove', function(e) {
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;
      if (mouseDown) {
        c.lineTo(mouseX, mouseY);
        c.stroke();
      }
    });
    $('#canvas').on('touchmove', function(e) {
      var pageX = e.originalEvent.touches[0].pageX;
      var pageY = e.originalEvent.touches[0].pageY;
      var mouseX = pageX - this.offsetLeft;
      var mouseY = pageY - this.offsetTop;
      if (mouseDown) {
        c.lineTo(mouseX, mouseY);
        c.stroke();
      }
    });
  }

  render() {
    return (
      <div className="App">
        <div className="leftPanel">
          <div className="canvasContainer">
            <canvas id="canvas" width="300" height="300"></canvas>
          </div>
          <div className="colours">
            <div className="black selected"></div>
            <div className="white"></div>
            <div className="red"></div>
            <div className="blue"></div>
            <div className="yellow"></div>
            <div className="green"></div>
            <div className="orange"></div>
            <div className="purple"></div>
          </div>
          <div className="toolSizes">
            <div className="small selected">
              <div className="example"></div>
            </div>
            <div className="medium">
              <div className="example"></div>
            </div>
            <div className="large">
              <div className="example"></div>
            </div>
          </div>
          <div className="submitButton">Submit Artwork</div>
        </div>
        <div className="rightPanel">
          <div className="artGalleryContainer"></div>
        </div>
      </div>
    );
  }
}

export default App;

