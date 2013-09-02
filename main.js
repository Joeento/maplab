var map;
var toggleFlag = false;
var toggleButton = document.getElementById("toggle-button");
var instructionsText = document.getElementById("instructions");
var canvas;
var ctx;
var lineList = new Array();
var startPoint;
var overlay = new google.maps.OverlayView();
overlay.draw = function() {};
var polygon = new google.maps.Polygon();
initCanvas();

//Classes
function Point(x,y) {
        this.x = x;
        this.y = y;
}


//Listeners
toggleButton.onclick = function() {
    toggleFlag = !toggleFlag;
    if (toggleFlag) {	
        lineList = new Array();
        canvas.width = canvas.width;
        startPoint = null;
        polygon.setMap(null);			
        document.getElementById('canvas_overlay').style.display = "block";
        toggleButton.innerHTML="Finished!";
        instructionsText.innerHTML  = "Great!  Now click anywhere on the map where you'd like create a polygon corner. When you're done, click \"Finished\".  You won't be able to zoom or pan while drawing."
    } else {
        instructionsText.innerHTML  = "Now you're done!  Your polygon will be processed and appear on the map in red."
        var left = map.getBounds().getNorthEast().lat();
        var top = map.getBounds().getSouthWest().lng();
        var triangleCoords= new Array();
        
        for (var i=0;i<lineList.length;i++) {
                var coordinates = overlay.getProjection().fromContainerPixelToLatLng(
                        new google.maps.Point(lineList[i].x, lineList[i].y)
                );
                triangleCoords.push(new google.maps.LatLng(coordinates.lat(), coordinates.lng()));
        }
        //alert(coordinates.lat() + ", " + coordinates.lng());
        
        // Construct the polygon
    polygon = new google.maps.Polygon({
                paths: triangleCoords,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
        });

        polygon.setMap(map);
        
        
        document.getElementById('canvas_overlay').style.display = "none";
        toggleButton.innerHTML="Draw Polygon";
            
    }
        
}		
canvas.onclick =function(e) {
        var x;
        var y;
        if (e.pageX || e.pageY) { 
          x = e.pageX;
          y = e.pageY;
        }
        else { 
          x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
          y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        } 
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        lineList.push(new Point(x,y));
        if (startPoint) {
                var endPoint = new Point(x,y)
                ctx.moveTo(startPoint.x,startPoint.y);
                ctx.lineTo(x,y);
                ctx.stroke();
                startPoint = endPoint;

        } else {
                startPoint = new Point(x,y);

        }
        
        return x;
}

//Helper Functions
function initialize() {
        var mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(41.8500, -87.6500),
                mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        overlay.setMap(map);
}
function initCanvas() {
        canvas = document.createElement("canvas");
        canvas.width=document.getElementById('map-canvas').offsetWidth;
        canvas.height=document.getElementById('map-canvas').offsetHeight;
        canvas.id="canvas_overlay";
        document.getElementsByTagName("body")[0].appendChild(canvas);
        ctx = canvas.getContext('2d');
        
}
google.maps.event.addDomListener(window, 'load', initialize);

