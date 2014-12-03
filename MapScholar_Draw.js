/////////////////////////////////////////////////////////////////////////////////////////////////////////
// DRAWING
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function MapScholar_Draw()												// CONSTRUCTOR
{
	this.segs=new Array();													// Holds drawn segs
	this.undos=new Array();													// Holds undos
	this.maxUndo=100;														// Max number of undos
	this.curSeg=-1;															// Current seg for editing
	this.curRandom=123;														// Current random #
	this.hasDots=false;														// No dots yet
	this.inAnnotate=false;													// Not in drawing
	this.dragInfo={ clicked:false, dragged:false,lat:0, lon:0, seg:null, point:null, coords:null };		// Drag information
	document.onkeydown=this.onBrowserKeyDown;								// Keydown listener
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// SCREENS 
/////////////////////////////////////////////////////////////////////////////////////////////////

MapScholar_Draw.prototype.DrawShelf=function()							// DRAW DRAWING SHELF
{
	var type="Draw";
	var ss="";
	if (this.curSeg != -1) {
		type=this.segs[this.curSeg].type;
		ss=" - "+this.curSeg;
		}
    str="<div align='center'><img width='160' height='174' src='img/MapScholarLogo.png'/></div>";
    str+="<div id='contentShelf' style='width:200px;height:401px;background-color:#fff;border:1px solid #999;margin:6px;padding:8px' class='rounded-corners'>";
	str+="<br/><div style='text-align:center'><b>"+type+"</b>"+ss+"</div><br/><table>";
	if (type == "Draw") {
		str+="<tr><td>To add a new segment, choose a type of segment to draw from the Draw selector pulldown menu. A segment will be added that can be edited."
		str+="<br/><br/><div style='text-align:center'><b>To edit</b></div>";
		str+="<br/>To edit an existing segment, click on that segment on the map to select it.";
		str+="<br/><br/>You can undo actions by clicking on the undo button to the left of the Save/Load button.";
		str+="<br/><br/>Click on the trashcan icon to remove the complete segment.";
		str+="<br/><br/><div style='text-align:center'><b>To save or load KML file</b></div>";
		str+="<br/>Click on the Save/Load button and enter your email. To save, give the KML file a title and click the Save button.<br/><br/>To load, choose the KML line and click the Load button. To append to the segments already drawn or loaded, hold the CONTROL (Command on Mac)key and click the Load button.";
		str+="</td></tr>"
		}
	else if ((type == "Line") || (type == "Shape")) {
		str+="<tr><td>Popup text&nbsp;</td><td><textarea rows='1' style='width:110px;font-size:x-small' id='annText2'></textarea></td></tr>";
		str+="<tr><td colspan='2'><p><hr/></p>";
		str+="Drag a point's icon to move that point on the map. If the CONTROL key (Command on Mac) is down, the point will snap to the nearest point near it.<br/><br/>Drag the segment itself to move the whole segment.";
		str+="<br/><br/>Click on a (+) icon in the segment to icon to insert a new point there.<br/><br/>Right-clicking will add a new point to the end of the line where you clicked.<br/><br/>Click on point icon with SHIFT key down to remove point.";
		str+="<br/><br/>Undo actions by clicking on the undo button to the left of the Save/Load button.";
		str+="<br/><br/>Click on the trash can icon to remove the complete segment.";
		str+="</td></tr>"
		}
	else if (type == "Image") {
		str+="<tr><td>Image URL&nbsp;</td><td><input type='text' style='width:130px;font-size:x-small' id='annUrl'/></td></tr>";
		str+="<tr><td valign='bottom'>Rotation&nbsp;</td><td><div id='annRot' style='width:100px;display:inline-block'</div>";
		str+="<input type='text' style='font-size:xx-small;vertical-align:top;border:none;background:none' id='annRot2'/></td></tr>";
		str+="<tr><td>Coords&nbsp;</td><td><textarea rows='5' style='width:130px;font-size:x-small' id='annPos'></textarea></td></tr>";
		str+="<tr><td colspan='2'><p><hr/></p>";
		str+="Drag corner dots to resize image. If Shift key is pressed, the image will be stretched. Drag the center of image to move the image.<br/><br/>";
		str+="You can fine-tune the rotation by dragging a corner point and pressing the Alt or Option key. Dragging point left of center rotates CCW, right rotates CW.";
		str+="<br/><br/>Click on the trash can icon to remove the image";
		str+="</td></tr>"
		}
	else if (type == "Box") {
		str+="<tr><td>Popup<br/>text&nbsp;</td><td><textarea rows='3' style='width:130px;font-size:x-small' id='annText2'></textarea></td></tr>";
		str+="<tr><td colspan='2'><p><hr/></p>";
		str+="Drag corner dots to resize box. Drag center of box to move the whole box.";
		str+="<br/><br/>Undo actions by clicking on the undo button to the left of the Save/Load button.";
		str+="<br/><br/>Click on the trash can icon to remove box";
		str+="</td></tr>"
		}
	else if (type == "Circle") {
		str+="<tr><td>Popup<br/>text&nbsp;</td><td><textarea rows='3' style='width:130px;font-size:x-small' id='annText2'></textarea></td></tr>";
		str+="<tr><td colspan='2'><p><hr/></p>";
		str+="Drag outer dot to resize circle. Use the Shift key to create elipses. Drag center to move the whole circle.";
		str+="<br/><br/>Undo actions by clicking on the undo button to the left of the Save/Load button.";
		str+="<br/><br/>Click on the trash can icon to remove circle";
		str+="</td></tr>"
		}
	else if (type == "Arrow") {
		str+="<tr><td>Popup<br/>text&nbsp;</td><td><textarea rows='3' style='width:130px;font-size:x-small' id='annText2'></textarea></td></tr>";
		str+="<tr><td colspan='2'><p><hr/></p>";
		str+="Drag corner dots to resize arrow. Drag center of arrow to move the whole arrow.";
		str+="<br/><br/>Undo actions by clicking on the undo button to the left of the Save/Load button.";
		str+="<br/><br/>Click on the trash can icon to remove box";
		str+="</td></tr>"
		}
	else if (type == "Marker") {
		str+="<tr><td>Label&nbsp;</td><td><input type='text' style='width:130px;font-size:x-small' id='annText'/></td></tr>";
		str+="<tr><td>Popup<br/>text&nbsp;</td><td><textarea rows='3' style='width:128px;font-size:x-small' id='annText2'></textarea></td></tr>";
		str+="<tr><td>Icon &nbsp;</td><td><input type='text' style='width:130px;font-size:x-small' id='annUrl'/></td></tr>";
		str+="<tr><td colspan='2'><p><hr/></p>";
		str+="Type \"pin\" in the the <i>Icon box</i> to show a pushpin icon, type \"none\" to show no icon, or type in a url to an image file. There are a number of icons <a href='http://www.viseyes.org/shiva/icons' target='_blank'> here</a>.";
		str+="<br/><br/>Text from the <i>Label box </i>appears to the right of the icon. When marker clicked, a popup will display any text entered in the <i>Popup text box</i>. You can use HTML formatting.";
		str+="<br/><br/>Click on the trash can icon to remove the marker";
		str+="</td></tr>"
		}
	if (this.curSeg != -1) {
		str+="<img src='img/trashdot.gif' style='position:absolute;left:10px;top:580px' title='Remove segment' id='annDelete'>";		
		if (this.segs[this.curSeg].lock)
			str+="<img src='img/lockdot.png' style='position:absolute;left:200px;top:580px' title='Unlock segment' id='annLock'>";		
		else
			str+="<img src='img/unlockdot.png' style='position:absolute;left:200px;top:580px' title='Lock segment' id='annLock'>";		
		}
	$("#shelfDiv").html(str+"</table></div>");
}

MapScholar_Draw.prototype.DrawControlBar=function(mode)						// DRAW MAP CONTROL BAR
{
	var _this=mps.dr;															// Point to draw obj
	if (mode != undefined) 	{													// If setting absolutely
		if (mode != this.inDraw)												// If changed
			shivaLib.Sound("click");											// Click
		this.inDraw=mode;														// Set mode
		}
	this.InitGraphics();														// Init graphics mode
	if (this.inDraw) {															// If annotation
		if (mps.sh.inPlay)														// If playing
			mps.sh.Play();														// Stop
		var s,col="#0000ff",ecol="#ffff00",ewid=2,vis=100,url="",text="",text2="",type="Draw",rot=0;
		if ($("#annType").val())												// If set
			type=$("#annType").val();											// Use that settinh
		if (this.curSeg != -1) {												// If editing
			s=this.segs[this.curSeg];											// Point at seg
			col=s.col;		ecol=s.ecol;	vis=s.vis;							// Get atts 
			ewid=s.ewid;	url=s.url;		rot=s.rot;							// from
			text=s.text;	text2=s.text2;	type=s.type;						// seg
			}
		var str="<p>"
		str+="&nbsp;&nbsp;<img width='18' height='18' src='img/globe.gif' style='vertical-align:bottom' title='Back to map' onclick='mps.dr.DrawControlBar(false)'>";		
		str+="&nbsp;&nbsp;&nbsp;<select id='annType' style='font-size:x-small' onchange='mps.dr.AddNewSeg()'>";
		str+="<option>Draw</option>";		str+="<option>Line</option>";		str+="<option>Shape</option>";
		str+="<option>Box</option>";		str+="<option>Arrow</option>";		str+="<option>Circle</option>";	
		str+="<option>Marker</option>";		str+="<option>Image</option>";		str+="</select>&nbsp;&nbsp;"; 
		if (type != "Draw") {													// If drawing/editng
			str+="Color&nbsp; <input type='text' size='1' style='font-size:x-small' id='annCol'/>&nbsp;&nbsp;&nbsp;";
			str+="Edge&nbsp; <input type='text' size='1' style='font-size:x-small;text-align:center;border:1px solid #999' id='annEwid'/>";
			str+="<input type='text' size='1' style='font-size:x-small' id='annEcol'/>&nbsp;&nbsp;&nbsp;";
			str+="Visibility&nbsp;&nbsp;<span id='annVis' style='width:100px;display:inline-block'></span>&nbsp;&nbsp;";
			str+="<input type='text' style='font-size:x-small;width:30px;height:14px;vertical-align:bottom;border:none;background:none'; id='annVis2'/>";
			}
		if (this.undos.length)
			str+="<img src='img/undodot.png' style='position:absolute;left:880px' title='Undo' id='annUndo'>";		
		str+="<input type='button' value='Save/Load' size='1' style='position:absolute;left:980px;font-size:x-small' id='annSave'/>";
		$("#controlBarDiv").html(str+"</p>")									// Add to DOM
		$("#annCol").css("background-color",col);								// Set back to col
		$("#annCol").css("border","1px solid "+col);							// Set border
		if (!col)		$("#annCol").val("  no").css("color","#666");			// Add no
		else			$("#annCol").val(col).css("color",col);					// Hide text
		$("#annEwid").val(ewid);												// Set wid
		$("#annEcol").css("background-color",ecol);								// Set back to col
		$("#annEcol").css("border","1px solid "+ecol);							// Set border	
		if (!ecol)		$("#annEcol").val("  no").css("color","#666");			// Add no
		else			$("#annEcol").val(ecol).css("color",ecol);				// Hide text
		$("#annVis").val(vis);													// Show cur vis in range
		$("#annVis2").val(vis);													// Show cur vis in text box too
		this.DrawShelf();														// Draw shelf
		$("#annText").val(text);												// Set text
		$("#annText2").val(text2);												// Set text2
		$("#annUrl").val(url);													// Set url
		$("#annRot").val(rot);													// Show cur rot
		$("#annRot2").val(rot);													// Set rot text
		if ((type == "Image") && (this.curSeg != -1)) {							// If rectifying
			str=s.lats[0]+"\t"+s.lats[1]+"\t"+s.lons[0]+"\t"+s.lons[1]+"\t"+s.rot;
			$("#annPos").val(str);												// Show cur pos for images
			SendShivaMessage("MapScholar=rectify",str.replace(/\t/g,"|"));		// Send rectify position to mapedit
			}
		}
	else{
		this.curSeg=-1;															// Not editing
		this.DrawMap();															// Draw map
		mps.sh.Draw();															// Draw main shelf
		}
	
	$("#annCol").click(function(e) { 										// SET COLOR
		_this.Do();																// Set undo	
		_this.ColorPicker("Col",e.pageX,654);									// Pick col
		});
		
	$("#annEwid").blur(function(e) {										// SET EDGE WIDTH 
		if (_this.curSeg != -1)	{												// If editing
			_this.Do();															// Set undo	
			_this.segs[_this.curSeg].ewid=$("#annEwid").val();					// Set ewid
			_this.StyleSeg(_this.curSeg);										// Set style
			}
		});
		
	$("#annEcol").click(function(e) { 										// SET EDGE COLOR
		_this.Do();																// Set undo	
		_this.ColorPicker("Ecol",e.pageX,654);									// Pick ecol
		});

	$("#annVis2").blur(function(e){ 										// SET VISIBILITY
		if (_this.curSeg != -1) {												// If editing
			_this.segs[_this.curSeg].vis=$("#annVis2").val();					// Set vis
			_this.StyleSeg(_this.curSeg);										// Set style
			$("#annVis").slider("option","value",$("#annVis2").val());			// Sync with text box
			}
		});

	$("#annRot2").blur(function(e){ 										// SET ROTATION
		if (_this.curSeg != -1) {												// If editing
			_this.segs[_this.curSeg].rot=$("#annRot2").val();					// Set rot
			_this.StyleSeg(_this.curSeg);										// Set style
			$("#annRot").slider("option","value",$("#annRot2").val());			// Sync with text box
			}
		});

	var ops={ min:0, max:360, value:rot,										// Slider options
		slide:function(event,ui) {												// Slide cb
		if (_this.curSeg != -1) {												// If editing
			_this.segs[_this.curSeg].rot=ui.value;								// Set rot
			_this.StyleSeg(_this.curSeg);										// Set style
			$("#annRot2").val(ui.value);										// Sync with text box
			}
		}};    
	$("#annRot" ).slider(ops);													// Init slider

	var ops={ min:0, max:100, value:vis,										// Slider options
		slide:function(event,ui) {												// Slide cb
		if (_this.curSeg != -1) {												// If editing
			_this.segs[_this.curSeg].vis=ui.value;								// Set vis
			_this.StyleSeg(_this.curSeg);										// Set style
			$("#annVis2").val(ui.value);										// Sync with text box
			}    
		}};   
	$("#annVis" ).slider(ops);													// Init slider

	$("#annDelete").click(function(e){ 										// DELETE SEG
		_this.Do();																// Set undo	
		_this.RemoveSeg(_this.curSeg);											// Remove from system
		shivaLib.Sound("delete");												// Delete
		$("#annType").val("Draw");												// Back to draw
		_this.curSeg=-1;														// Not editing																					
 		_this.DrawMap();														// Redraw map
		_this.DrawControlBar(true);												// Draw control bar
		});

	$("#annLock").click(function(e){ 										// LOCK/UNLOCK SEG
		shivaLib.Sound("click");												// Click
		_this.segs[_this.curSeg].lock=!_this.segs[_this.curSeg].lock;			// Toggle lock state	
		_this.DrawShelf();														// Redraw shelf
		_this.DrawMap();														// Redraw map
		});

	$("#annText").blur(function(e){ 										// SET TEXT
		if (_this.curSeg != -1)	{												// If editing
			_this.Do();															// Set undo	
			_this.segs[_this.curSeg].text=$("#annText").val();					// Set text
			_this.StyleSeg(_this.curSeg);										// Set style
			}
		_this.DrawMap();														// Redraw map
		});

	$("#annText2").blur(function(e){ 										// SET TEXT2
		if (_this.curSeg != -1)	{												// If editing
			_this.Do();															// Set undo	
			_this.segs[_this.curSeg].text2=$("#annText2").val();				// Set text2
			_this.StyleSeg(_this.curSeg);										// Set style
			}
		_this.DrawMap();														// Redraw map
		});

	$("#annUrl").blur(function(e){ 											// SET URL
		if (_this.curSeg != -1)	{												// If editing
			_this.Do();															// Set undo	
			_this.segs[_this.curSeg].url=$("#annUrl").val();					// Set url
			_this.StyleSeg(_this.curSeg);										// Set style
			}
		_this.DrawMap();														// Redraw map
		});

	$("#annSave").click(function(e){ 										// SAVE/LOAD
		var kml=_this.CreateKML();												// Make KML
		$.proxy(shivaLib.EasyFile(kml,_this.ParseKML,"KML"),shivaLib); 			// Run eStore
		});

	$("#annUndo").click(function(e){ 										// UNDO
		if (_this.Undo()) {														// If a success
			shivaLib.Sound("ding");												// Ding
			_this.DrawMap();													// Refresh map
			_this.DrawControlBar(true);											// Update control bar
			}
		});

}

MapScholar_Draw.prototype.AddNewSeg=function(defs)							// ADD NEW SEGMENT
{
	var type=$("#annType").val(),v;												// Get type
	this.DrawControlBar(true);													// Draw control bar
	this.curSeg=-1;																// Deselect
	if (mps.mm == "ol")															// If OL
		return;																	// Quit
	$("#annType").val("Draw");													// Reset control
	var o=new Object();
	o.type=type;																// Set type
	o.lats=new Array();		o.lons=new Array();									// Add coord arrays
	o.vis=$("#annVis").val()-0;													// Set vis
	o.col=$("#annCol").val();													// Set col
	o.ecol=$("#annEcol").val();													// Set ecol
	o.ewid=$("#annEwid").val()-0;												// Set ewid
	o.lock=false;																// Unlocked

	var ge=shivaLib.map;														// Local copy of earth
	var lookAt=ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);		// Get pos
	var bounds=ge.getView().getViewportGlobeBounds();							// Get bounds
	var w=(bounds.getEast()-bounds.getWest())/40;								// Width	
	
	if (type == "Marker") {														// A marker
		o.text="New Marker";													// Set text
		o.lats.push(lookAt.getLatitude());										// Add center lat
		o.lons.push(lookAt.getLongitude());										// Add lon
		}
	else if ((type == "Box") || (type == "Circle") || (type == "Image")) {		// Box/Image/Circle
		if (defs) 																// If defaults are provided
			v=defs.split("|");													// Get parts
		if (defs && v[4]) {														// If pos set
			o.lats.push(v[4]-0);												// Set N
			o.lats.push(v[5]-0);												// Set S
			o.lons.push(v[6]-0);												// Set E
			o.lons.push(v[7]-0);												// Set W
			o.rot=v[8]-0;														// Set R
			}
		else{																	// Make one up
			o.lats.push(lookAt.getLatitude()+w);								// Add lat
			o.lons.push(lookAt.getLongitude()+w);								// Add lon
			o.lats.push(lookAt.getLatitude()-w);								// Add lat
			o.lons.push(lookAt.getLongitude()-w);								// Add lon
			o.rot=0;															// Set url
			}
		if (type == "Image") {													// If image
			o.url="http://www.viseyes.org/shiva/map.jpg";						// Put in dummy
			if (defs) {															// If defaults are provided
				if (v[2])		o.url=v[2];										// Med first
				else if (v[3])	o.url=v[3];										// Large second
				else if (v[1])	o.url=v[1];										// Small last resort
				}
			}
		}
	else if ((type == "Shape") || (type == "Line") || (type == "Arrow")) {		// Shape/Line/Arrow
		if (type == "Arrow")													// If arrow
			o.ewid=Math.floor(w*10)/10,o.ecol="";								// Set shaft width, no edge
		o.lats.push(lookAt.getLatitude());										// Add lat
		o.lons.push(lookAt.getLongitude()+w);									// Add lon
		if (type == "Shape") {													// A shape
			o.lats.push(lookAt.getLatitude()+(w/2));							// Add lat
			o.lons.push(lookAt.getLongitude());									// Add lon
			}
		o.lats.push(lookAt.getLatitude());										// Add lat
		o.lons.push(lookAt.getLongitude()-w);									// Add lon
		}
	else																		// Unknown type
		return false;															// Quit
	this.Do();																	// Set undo	
	this.segs.push(o);															// Add seg
	this.AddSegsToEarth(this.segs.length-1,defs != undefined);					// Add to EDOM
	shivaLib.Sound("ding");														// Ding
	this.curSeg=this.segs.length-1;												// Highlight current one																				
	this.DrawMap();																// Redraw map
	this.DrawControlBar(true);													// Draw control bar
	return true;																// OK
}

MapScholar_Draw.prototype.ColorPicker=function(which, x, y)					// COLOR PICKER
{	
	if (($("#edcpCol").length || $("#edcpEcol").length))						// If any bars up
		return																	// Quit
	var str="<img src='img/colorbar.png' id='edcp"+which+"' style='position:absolute;top:"+y+"px;left:"+(x-100)+"px'/>"
	$("body").append(str);														// Add to DOM
     $("#edcp"+which+"").click(function(e) {									// Click handler
	    var cols=["ffffff","999999","666666","333333","000000","ff0000",		// Color list
	    		  "00ff00","0000ff","00ffff","ff00ff","ffff00","f59d00",
	    		  ""];
	  	var which=e.target.id.substr(4); 										// Get which var
	    var col=cols[Math.floor((e.pageX-this.offsetLeft)/15)];					// Set color
		if (col) col="#"+col;													// Add #	
		$("#ann"+which).css("background-color",col);							// Set interior
		$("#ann"+which).css("border","1px solid "+col);							// Border
		if (!col)		$("#ann"+which).val("  no").css("color","#666");		// Add no
		else			$("#ann"+which).val(col).css("color",col);				// Hide text
		if (mps.dr.curSeg != -1) {												// If editing
			mps.dr.segs[mps.dr.curSeg][which.toLowerCase()]=col;				// Set var	
			mps.dr.StyleSeg(mps.dr.curSeg);										// Set style
	 		}
	 	$("#"+e.target.id).remove();											// Remove bar
 		});
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// OL 
/////////////////////////////////////////////////////////////////////////////////////////////////

MapScholar_Draw.prototype.InitGraphics=function()							// INIT GRAPHICS DRAWING
{
//	if (mps.mm == "ge")															// If GE
		return;																	// Quit
	var map=shivaLib.map;														// Point at map
	if (!this.inDraw) {															// If not drawing
		if (this.modifyInter)													// If defined
			 map.removeInteraction(this.modifyInter); 							// Remove it
		if (this.drawInter)														// If defined
			 map.removeInteraction(this.drawInter); 							// Remove it
		if (this.selectInter)													// If defined
			 map.removeInteraction(this.selectInter); 							// Remove it
 		return;																	// Quit
		}
	
	map.addInteraction( this.selectInter=new ol.interaction.Select());			// Add select
	this.selectInter.getFeatures().on('change:length', function(e) {			// On new point added
		var i=mps.drawLayer.getFeatures().getArray().length;					// Get length of features already drawn
		if (e.target.getArray().length !== 0) 									// If something there
       		e.target.item(0).once("change",function(e) { 						// On change 
      			mps.dr.curSketch=e.target; 										// Set sketch feature
				mps.dr.curSketch.setId("dseg"+i);								// Set id
    			})
		});

	map.addInteraction( this.modifyInter=new ol.interaction.Modify({			// Add modify
	 		features: mps.drawLayer.getFeatures(),								// Point at features
	  		deleteCondition: function(e) {										// On delete
				var state=(ol.events.condition.shiftKeyOnly(e) && ol.events.condition.singleClick(e));	// Shift-click
				if (state)														// Deleting
					Sound("delete");											// Delete sound
  	    		return state;													// Retrun state
	  			}	
			})
		);

	map.addInteraction( this.drawInter=new ol.interaction.Draw({				// Add draw tool
	 		features: mps.drawLayer.getFeatures(),								// Point at features
			type: "LineString"
 			})
		);

	sty=new ol.style.Style({									
			fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.2)' }),		// Final fill
			stroke: new ol.style.Stroke({ color: '#ff9900', width: 1 }),		// Final stroke
			})
	mps.drawLayer.setStyle(sty); 
	
	$(document).on("keyup",function(e) { 										// HANDLE KEYS
   		if (e.which == 27) {													// ESC key
    		if (mps.dr.curSketch)												// If sketching
	  			mps.dr.drawInter.finishDrawing_(e);								// Close drawing
  			}
   		if (e.which == 8) {														// DEL key
    		if (!mps.dr.curSketch)												// If not sketching
    			return;															// Quit
 			a=mps.dr.curSketch.getGeometry().getCoordinates();  				// Get ccords
			if (a.length > 1) {													// If more than moveto point
				a.pop();														// Remove it
				Sound("delete");												// Delete
				mps.dr.curSketch.getGeometry().setCoordinates(a,"XY");			// Reset coords
				}
   			}
  	 })
 
 }
  
/* 
 function SaveAsKML()													// SAVE LAYER AS KML
 {
    var features=[];														// Hold features
    var a=mps.drawLayer.getFeatures().getArray();							// Get features drawn
    for (i=0;i<a.length;++i) {												// For each feature
        var clone=a[i].clone();												// Clone feature
        clone.setId("KF-"+i);  												// Set id
       	clone.getGeometry().transform("EPSG:3857","EPSG:4326");				// Project
        features.push(clone);												// Add to list
      }
     var node=new ol.format.KML().writeFeatures(features);					// Format as KML/XML
     var str=new XMLSerializer().serializeToString((node));					// Serialize as string
}

 function LoadKML()														// CONVERT KML TO LAYER
 {
 }
 */ 

//////////////////////////////////////////////////////////////////////////////////////////////////
// EARTH 
/////////////////////////////////////////////////////////////////////////////////////////////////


MapScholar_Draw.prototype.DrawMap=function()								// DRAW MAP
{		
  	this.DrawControlDots((this.curSeg != -1));									// Add control dots	if editing
}

MapScholar_Draw.prototype.AddSegsToEarth=function(num, hasRectify)			// ADD SEGMENTS TO EDOM
{	
	var i,j,s,point,coords,polygon,seg;
	var start=0,end=this.segs.length;											// Assume whole list
	if (num != undefined)														// If adding
		start=num,end=(num+1);													// Narrow range to add
	var ge=shivaLib.map;														// Point to earth												
	for (i=start;i<end;++i) {													// For each seg
		s=this.segs[i];															// Point at seg
		s.id=""+Math.floor(Math.random()*99999999);								// Make random #
		if (s.type != "Image") {												// Not for images
			seg=ge.createPlacemark(s.id);										// Create holder
			seg.setStyleSelector(ge.createStyle(''));							// Create style
			}
		if ((s.type == "Shape") || (s.type == "Box") || (s.type == "Circle") ||(s.type == "Arrow")) {	// If a polygon, box, circle, or arrow
			polygon=ge.createPolygon('');										// Add it
			coords=ge.createLinearRing('');										// Holds coords
			seg.setGeometry(polygon);											// Set coords in seg
			polygon.setOuterBoundary(coords)									// Add coords
			}
		else if (s.type == "Line") {											// If a line
			coords=ge.createLineString('');										// Holds coords
			seg.setGeometry(coords);											// Set coords in seg
			}
		else if (s.type == "Marker") {											// If a marker
			point=ge.createPoint('');											// Create point
			point.setLatitude(s.lats[0]);										// Set lat
			point.setLongitude(s.lons[0]);										// Set lon
			seg.setGeometry(point);												// Set point in seg
			}
		if ((s.type == "Line") || (s.type == "Shape")){ 						// Has geometry
			seg.getStyleSelector().getLineStyle();								// Add a line style obj
			for (j=0;j<s.lats.length;++j)										// For each point
				coords.getCoordinates().pushLatLngAlt(s.lats[j],s.lons[j],0);	// Add point
			}
		else if (s.type == "Box") {												// If a box
			coords.getCoordinates().pushLatLngAlt(s.lats[0],s.lons[0],0);		// Top-left corner
			coords.getCoordinates().pushLatLngAlt(s.lats[0],s.lons[1],0);		// TR
			coords.getCoordinates().pushLatLngAlt(s.lats[1],s.lons[1],0);		// BR
			coords.getCoordinates().pushLatLngAlt(s.lats[1],s.lons[0],0);		// BL
			}
		else if (s.type == "Circle") 											// If a circle
			this.MakeCircle(s.lons,s.lats,s.ewid,coords.getCoordinates());		// Create circle
		else if (s.type == "Arrow") 											// If an arrow
			this.MakeArrow(s.lons,s.lats,s.ewid,coords.getCoordinates());		// Create arrow
		else if (s.type == "Image") {											// If an image
			seg=ge.createGroundOverlay(s.id);									// Create holder
			var latLonBox=ge.createLatLonBox('');								// Create box
			latLonBox.setBox(s.lats[0],s.lats[1],s.lons[0],s.lons[1],1000);		// Set coords
			seg.setLatLonBox(latLonBox);										// Set geometry
			var icon=ge.createIcon('');											// Create icon
			seg.setDrawOrder(-1);												// Allow overlays on it
			seg.setIcon(icon);													// Attach to seg
			s.asp=0;															// No aspect yet
			}
		ge.getFeatures().appendChild(seg);										// Add seg to EDOM
		this.StyleSeg(i,hasRectify);											// Style it
		}
}

MapScholar_Draw.prototype.StyleSeg=function(num, hasRectify)				// SET SEGMENT STYLING
{	
	var r,g,b,a;
	var ge=shivaLib.map;														// Local copy of earth
	var s=this.segs[num];														// Point at seg
	var seg=ge.getElementById(s.id);											// Get object
	if (s.type != "Image") {													// If not an image
		var lineStyle=seg.getStyleSelector().getLineStyle();					// Get line style
		var polyStyle=seg.getStyleSelector().getPolyStyle();					// Get poly style
		}
	a=Math.floor(s.vis*2.555).toString(16);										// Get alpha
	if (a.length < 2)	a="0"+a;												// Pad it			
	if (lineStyle) {															// If it has one
		if ((s.ecol != undefined) && (s.ecol != "")) {							// If has color	
			r=s.ecol.substr(1,2);												// Get red
			g=s.ecol.substr(3,2);												// Get green
			b=s.ecol.substr(5,2);												// Get blue
			lineStyle.getColor().set(a+b+g+r);  								// Set color in aabbggrr format
			}
		if (s.ewid)																// If exists
			lineStyle.setWidth(Number(s.ewid));									// Set width
		if (s.type == "Arrow")													// If an arrow	
			lineStyle.setWidth(2);												// Force width to 2
		}
	if (polyStyle) {															// If it has one
		if ((s.col != undefined) && (s.col != "")) {							// If has color	
			r=s.col.substr(1,2);												// Get red
			g=s.col.substr(3,2);												// Get green
			b=s.col.substr(5,2);												// Get blue
			polyStyle.getColor().set(a+b+g+r);  								// Set color in aabbggrr format
			}
		else																	// No color
			polyStyle.getColor().set("00000000");  								// No interior color
		polyStyle.setOutline(s.ecol != "")										// Set outline
		}
	if (s.type == "Marker") {													// If a marker
		var url=s.url;															// Point at URL
		if (!url) 																// No url set
			url="http://www.viseyes.org/mapscholar/img/dotmarker.png";			// Use dot marker
		else if (url == "none") 												// If none
			url="http://www.viseyes.org/mapscholar/img/nomarker.png";			// Use invisible marker
		var style=ge.createStyle('');											// Create style
		var icon=ge.createIcon('');												// Create icon
		icon.setHref(url);														// Set url										
		if (url == "pin") 														// If pin
			style.getIconStyle().setIcon(null);									// Null icon style
		else																	// A cutom style
			style.getIconStyle().setIcon(icon);									// Set icon style
		seg.setStyleSelector(style);											// Set icon
		}
	else if (s.type == "Image") {												// If an Image
		if ((s.url) && (seg.getIcon().getHref() != s.url)) {					// A new url
			seg.getIcon().setHref(s.url);										// Set url
			var _this=this;														// Point to module
			var testImg=new Image();											// Test image to get sizes
			testImg.src=s.url;													// Set url
			testImg.onload=function() {											// When loaded
				var s=_this.segs[num];											// Point at seg
				s.asp=this.height/this.width;  									// Get aspect ratio
				if (!hasRectify)												// If rectifaction coords do not already exist
					s.lats[1]=s.lats[0]-Math.abs(s.lons[0]-s.lons[1])*s.asp;	// Set height
				var a=s.rot;													// Get 0 -> 360 rot
				if (a > 180) a=-(360-a);										// Convert -180 -> +180
				latLonBox.setBox(s.lats[0],s.lats[1],s.lons[0],s.lons[1],Number(a));	// Set coords						
				_this.DrawMap(true);											// Redraw
				};
			}
		seg.setOpacity(s.vis/100);												// Set opacity
		var latLonBox=seg.getLatLonBox();										// Get coords	
		var a=s.rot;															// Get 0 -> 360 rot
		if (a > 180) a=-(360-a);												// Convert -180 -> +180
		latLonBox.setRotation(Number(a));										// Set rotation
		}
	else if (s.type == "Arrow") 												// If an arrow
		this.MakeArrow(s.lons,s.lats,s.ewid,seg.getGeometry().getOuterBoundary().getCoordinates());		// Reset arrow
	else if (s.type == "Circle") 												// If an arrow
		this.MakeCircle(s.lons,s.lats,s.ewid,seg.getGeometry().getOuterBoundary().getCoordinates());	// Reset circle
	if (s.text)																	// If exists
		seg.setName(s.text);													// Set label
	if (s.text2)																// If exists
		seg.setDescription(s.text2);											// Set balloon contents
}

MapScholar_Draw.prototype.MakeCircle=function(xs, ys, wid, coords)			// CONSTRUCT ARROW
{		
	var x=new Array();
	var y=new Array();
	var dx=Math.abs(xs[0]-xs[1]);												// Delta x
	var dy=Math.abs(ys[0]-ys[1]);												// Delta y
	var n=64;																	// Number of steps
	
	if ((coords) && (!coords.getLength()))										// If coords not added yet
		for (i=0;i<n;++i)														// For each point
			coords.pushLatLngAlt(0,0,0);										// Add coord
	for (i=0;i<n;++i) {															// For each point	
  		x.push(xs[1]+dx*Math.cos(2*Math.PI*i/n));
   		y.push(ys[1]+dy*Math.sin(2*Math.PI*i/n));
   		}
   	if (coords) {																// If saving to Earth
		for (i=0;i<n;++i)														// For each point
			coords.setLatLngAlt(i,y[i]-0,x[i]-0,0);								// Set point
			}
	else{																		// Saving to array
		coords=new Array();														// Alloc array
		for (i=0;i<n;++i) {														// For each point
			coords[i*2]=x[i];													// Lon
			coords[i*2+1]=y[i];													// Lat
			}	
		return coords;															// Return array
		}
} 	
	

MapScholar_Draw.prototype.MakeArrow=function(xs, ys, wid, coords)			// CONSTRUCT ARROW
{		
	var x=new Array();
	var y=new Array();
	var dx=xs[0]-xs[1];															// Delta x
	var dy=ys[0]-ys[1];															// Delta x
	var aa=Math.atan2(dy,dx);													// Angle of line -pi - +pi
	var cos=Math.cos(aa-1.5707);												// +90 degree cos
	var sin=Math.sin(aa-1.5707);												// +90 degree sin
	var cos2=Math.cos(aa);														// 0 degree cos
	var sin2=Math.sin(aa);														// 0 degree sin
	wid/=10;																	// Use only .1 of width
	var wid2=wid*3;																// Tip width
	
	if ((coords) && (!coords.getLength()))										// If coords not added yet
		for (i=0;i<7;++i)														// For each point in arrow
			coords.pushLatLngAlt(0,0,0);										// Add coord

	var pct=1-wid/Math.sqrt(dx*dx+dy*dy);										// Pct of shaft
	x.push(wid*cos+xs[1]);		y.push(wid*sin+ys[1]);							// TLC								
	x.push(wid*cos+xs[0]);		y.push(wid*sin+ys[0]);							// Arrow start		
	x.push(wid2*cos+xs[0]);		y.push(wid2*sin+ys[0]);							// Arrow top		
	x.push(wid2*cos2+xs[0]);	y.push(wid2*sin2+ys[0]);						// Arrow tip		
	x.push(-wid2*cos+xs[0]);	y.push(-wid2*sin+ys[0]);						// Arrow bot		
	x.push(-wid*cos+xs[0]);		y.push(-wid*sin+ys[0]);							// Arrow End		
	x.push(-wid*cos+xs[1]);		y.push(-wid*sin+ys[1]);							// BLC							
	if (coords) {																// If saving to Earth
		for (i=0;i<7;++i)														// For each point in arrow
			coords.setLatLngAlt(i,y[i]-0,x[i]-0,0);								// Set point
			}
	else{																		// Saving to array
		coords=new Array();														// Alloc array
		for (i=0;i<7;++i) {														// For each point in arrow
			coords[i*2]=x[i];													// Lon
			coords[i*2+1]=y[i];													// Lat
			}	
		return coords;															// Return array
		}
} 	
	
//////////////////////////////////////////////////////////////////////////////////////////////////
// EDITING 
/////////////////////////////////////////////////////////////////////////////////////////////////

MapScholar_Draw.prototype.DrawControlDots=function(mode) 					// ADD COORD EDITING DOTS			
{
	var i,j,a,b,o,n,seg;
	var ge=shivaLib.map;														// Local copy of earth
	if (typeof(ge) == "string") 												// If not initted yet
		return;																	// Quit
	while (this.hasDots) {														// Loop
		seg=ge.getFeatures().getChildNodes();									// Get seg									
		n=seg.getLength();														// Get length
		for (i=0;i<n;++i) {														// For each child
			if (seg.item(i).getId().indexOf("cd-") != -1) {						// If a control dot
				ge.getFeatures().removeChild(seg.item(i));						// Remove dot	
				seg.item(i).release();											// Release it
				break;															// Start from the top
				}
			}	
		if (i == n)																// If not found
			break; 																// Quit looking altogether
		}
	this.hasDots=false;															// No dots
	if (mode == false)															// If deleting
		return;																	// Turn them off
	if (this.curSeg == -1)														// Nothing selected
		return;																	// Quit
	var s=this.segs[this.curSeg];												// Point at seg
	if (s.type == "Marker")														// Not needed for markers
		return;																	// Quit
	if (s.lock)																	// If locked
		return;																	// Quit
	this.curRandom=""+Math.floor((Math.random()*999)+1);						// Make random # 1-999
	n=3-this.curRandom.length;													// Get length
	for (i=0;i<n;++i)															// For each missing digit
		this.curRandom="0"+this.curRandom;										// Pad
	if (!s.lons.length)															// If no coords
		return;																	// Quit
	this.hasDots=true;															// Have dots
	this.AddCoordControlDot(s.lats[0],s.lons[0],0,.5);							// Add 1st dot								
	for (i=1;i<s.lons.length;++i) {												// For all other dots
		j=i-1;																	// Last dot index
		this.AddCoordControlDot(s.lats[i],s.lons[i],i,.5);						// Add dot
		a=((s.lats[i]-s.lats[j])/2)+s.lats[j];									// Middle lat
		b=((s.lons[i]-s.lons[j])/2)+s.lons[j];									// Middle lon
		if ((s.type == "Line") || (s.type == "Shape"))							// If line or shape
			this.AddCoordControlDot(a,b,(i-.5),.25);							// Add middle dot	
		}
}

MapScholar_Draw.prototype.AddCoordControlDot=function(lat, lon, num, scale)	// ADD COORD CONTROL DOT
{
	var ge=shivaLib.map;														// Local copy of earth
	var placemark=ge.createPlacemark(this.curRandom+"cd-"+num);					// Create named placemark
	var point=ge.createPoint('');												// Create point
	var icon=ge.createIcon('');													// Create icon
	var styleMap=ge.createStyleMap('');											// Create style map
	var normalStyle=ge.createStyle(''); 										// Create style
	if (scale == .5)															// Coord icon
		icon.setHref('http://www.viseyes.org/mapscholar/img/coordcir.png');		// Set icon url
	else																		// Add icon
		icon.setHref('http://www.viseyes.org/mapscholar/img/coordadd.png');		// Set icon url
	normalStyle.getIconStyle().setIcon(icon); 									// Set icon		
	normalStyle.getIconStyle().setScale(scale);									// Set icon scale
	styleMap.setNormalStyle(normalStyle);										// Set normal style

	var highlightStyle=ge.createStyle(''); 										// Create style
	icon=ge.createIcon('');														// Create icon
	if (scale == .5) {															// Coord icon
		icon.setHref('http://www.viseyes.org/mapscholar/img/coordsel.png');		// Set icon url
		highlightStyle.getIconStyle().setScale(1.5);							// Set icon scale
		}
	else{																		// Add icon
		icon.setHref('http://www.viseyes.org/mapscholar/img/coordadd.png');		// Set icon url
		highlightStyle.getIconStyle().setScale(.75);								// Set icon scale
		}
	highlightStyle.getIconStyle().setIcon(icon); 								// Set icon		
	styleMap.setHighlightStyle(highlightStyle);									// Set highlight style
	placemark.setStyleSelector(styleMap); 										// Add icon to placemark
	point.setLatitude(lat);														// Set lat
	point.setLongitude(lon);													// Set lon
	placemark.setGeometry(point);												// Place icon
	ge.getFeatures().appendChild(placemark);									// Add to DOM
}	

MapScholar_Draw.prototype.AddPointToLine=function(num, lat, lon)			// ADD NEW POINT TO LINE
{
	var i;
	var o=this.dragInfo.coords;													// Point at coords
	var s=this.segs[this.curSeg];												// Point at seg
	if ((s.type != "Line") && (s.type != "Shape"))								// If not line or shape
		return;																	// Quit
	if (!lat) {																	// If not lat/lon defined
		lat=(s.lats[num]+(s.lats[num+1]-s.lats[num])/2);						// Bisected lat
		lon=(s.lons[num]+(s.lons[num+1]-s.lons[num])/2);						// Lon
		if (lat == s.lats[num] && (lon == s.lons[num]))							// If same as last point
			return;																// Don't add
		if (lat == s.lats[num+1] && (lon == s.lons[num+1]))						// If same as next point
			return;																// Don't add
		s.lats.splice(num+1,0,lat);												// Add lat to array									
		s.lons.splice(num+1,0,lon);												// Add lon							
		}
	else{																		// Freeform	
		i=s.lats.length-1;														// Last point
		if (lat == s.lats[i] && (lon == s.lons[i]))								// If same as last point
			return;																// Don't add
		s.lats.push(lat);														// Add new lat
		s.lons.push(lon);														// Add new lat
		}		
	o.pushLatLngAlt(lat,lon,0);													// Add a new coord
	for (i=0;i<s.lats.length;++i)												// For each coord
		o.setLatLngAlt(i,s.lats[i],s.lons[i],0);								// Set it
	shivaLib.Sound("click");													// Click
	this.DrawControlDots(true);													// Redraw control dots
}

MapScholar_Draw.prototype.RemovePointFromSeg=function(num)					// REMOVE POINT FROM SEGMENT
{
	var i;
	var s=this.segs[this.curSeg];												// Point at seg
	var o=this.dragInfo.coords;													// Point at coords
	s.lats.splice(num,1);														// Remove lat to array									
	s.lons.splice(num,1);														// Remove lon							
	o.pop();																	// Remove kml dot
	for (i=0;i<s.lats.length;++i)												// For each coord
		o.setLatLngAlt(i,s.lats[i],s.lons[i],0);								// Set it
	this.DrawControlDots(true);													// Redraw control dots
}

MapScholar_Draw.prototype.RemoveSeg=function(num)							// REMOVE SEGMENT
{
	var ge=shivaLib.map;														// Point at earth
	var o=ge.getElementById(this.segs[num].id);									// Find seg
	ge.getFeatures().removeChild(o);											// Remove line	
	this.segs.splice(num,1);													// Remove from segs
}

MapScholar_Draw.prototype.ClearSegs=function()								// REMOVE ALL SEGMENTS
{
	while (this.segs.length)													// For each seg
		this.RemoveSeg(0);														// Remove it
	this.curSeg=-1;																// Not editing
}	

MapScholar_Draw.prototype.GetNearestPoint=function(lat, lon)				// GET CLOSEST POINT
{
	var i,j,s,d;
	var closest=99999999999;													// Init far away
	var newLat=lat;																// Init to target
	var newLon=lon;																// Init to target
	for (i=0;i<this.segs.length;++i) {											// For each seg
		s=this.segs[i];															// Point at it
		for (j=0;j<s.lats.length;++j) {											// For each coord
			d=(lon-s.lons[j])*(lon-s.lons[j]);									// Calc
			d+=(lat-s.lats[j])*(lat-s.lats[j]);									// Euclidean distance
			if ((d < closest) && (d)) {											// A new closest, but not this point
				closest=d*d;													// Set closest, squared to avoid sqrt
				newLat=s.lats[j];												// Set new lat
				newLon=s.lons[j];												// Set new lat
				}
			}
		}		
	return [newLat,newLon];														// Return new point	
}


//////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTS 
/////////////////////////////////////////////////////////////////////////////////////////////////

MapScholar_Draw.prototype.InitEvents=function()								// INIT EVENTS
{	
	if (mps.mm != "ge")															// If not GE
		return;																	// Quit

	var _this=mps.dr;															// Point to draw obj
	var ge=shivaLib.map;														// Point at earth

	google.earth.addEventListener(ge.getGlobe(),"mousedown", 				// ON MOUSE DOWN
		function(e) {
			var s,i,n,o,num;
			if (!_this.inDraw) {												// If not annotating
		    	mps.ClickHandler(e);											// Call main click handler
		    	return;															// Quit
				}
			var id=e.getTarget().getId();										// Find id
		  	var type=e.getTarget().getType();									// Get type
			if (type != "GEGlobe")												// If something hit
				type=e.getTarget().getGeometry().getType();						// Get type from geometry
			if ((e.getButton()) && (_this.curSeg != -1) && (!e.getShiftKey())){	// If appending dot
				if (!_this.segs[_this.curSeg].lock)	{							// If not locked
					_this.Do();													// Undo
	 				mps.dr.AddPointToLine(0,e.getLatitude(),e.getLongitude());	// Add to line/shape
	 				}
 				return;
				}
		  	if (type == "KmlPoint") { 											// If point
				num=Math.floor(e.getTarget().getId().substr(6));				// Get index into line
				if (id.substr(3,3) != "cd-") {									// If not a control dot, must be a marker
					for (i=0;i<_this.segs.length;++i) {							// Look through list
						if (_this.segs[i].id == id) {							// If id matches
							_this.curSeg=i;										// This is curseg
							num=0;												// Move 1st point
							break;												// Quit looking
							}
						}
					}
				s=mps.dr.segs[mps.dr.curSeg];									// Point at seg
				if (s.lock)														// If locked
					return;														// Quit
				_this.Do();														// Set undo	
				_this.dragInfo.lat=0;											// Disable seg moving
		    	_this.dragInfo.clicked=true;									// Been clicked on
		    	_this.dragInfo.point=e.getTarget().getGeometry();				// Point coords
				_this.dragInfo.rot=s.rot;										// Save rotation
				if (s.type == "Image") 											// If an image
					s.asp=Math.abs(s.lats[0]-s.lats[1])/Math.abs(s.lons[0]-s.lons[1]);	// Set aspect ratio
		    	o=shivaLib.map.getFeatures().getChildNodes();					// Get seg									
				n=o.getLength();												// Get length
				for (var i=0;i<n;++i) 											// For each child
					if (o.item(i).getId().indexOf(s.id) != -1) {				// If a control dot
						_this.dragInfo.seg=o.item(i);							// Point at seg
						_this.DrawControlBar(true);								// Update control bar
						break;													// Quit looking
						}
		    	if ((s.type == "Shape") || (s.type == "Box") || (s.type == "Circle") || (s.type == "Arrow")) // A polygon, box, circle, or arrow
		    		_this.dragInfo.coords=_this.dragInfo.seg.getGeometry().getOuterBoundary().getCoordinates();	
				else
					_this.dragInfo.coords=_this.dragInfo.seg.getGeometry().getCoordinates()
				if (id.indexOf(".5") != -1) { 									// A mid point
					_this.Do();													// Set undo	
	 				mps.dr.AddPointToLine(num,0,0);								// Bisect line
 		 			}
	     		else if (id.substr(3,3) == "cd-")	{							// If a control dot
			    	if (e.getShiftKey() && ((s.type == "Shape") || (s.type == "Line"))) {	 // Delete point from line/shape									// Right-clicked
						if ((s.type == "Shape") && (s.lats.length < 4)) 		// Got to have min of 3
							return;												// Quit
						else if (s.lats.length < 3) 							// Got to have min of 2
							return;												// Quit
						_this.Do();												// Set undo	
						shivaLib.Sound("delete");								// Delete
						_this.RemovePointFromSeg(num);							// Remove it
			    		}
					}
				}
		    else{ 																// Look for seg
				var hasImg=false;												// Assume no images
				for (i=0;i<_this.segs.length;++i) {								// Look through list
				    s=_this.segs[i];											// Point at seg data
				    if (s.type == "Image")										// If an image
				    	hasImg=true;											// Set flag
					else if (_this.segs[i].id == id) {							// If id matches
						_this.curSeg=i;											// This is curseg
							_this.dragInfo.seg=shivaLib.map.getElementById(_this.segs[_this.curSeg].id)
				    	if ((s.type == "Shape") || (s.type == "Box") || (s.type == "Circle") || (s.type == "Arrow")) // A polygon, box, circle, or arrow
		    				_this.dragInfo.coords=_this.dragInfo.seg.getGeometry().getOuterBoundary().getCoordinates();	
						else													// A line
							_this.dragInfo.coords=_this.dragInfo.seg.getGeometry().getCoordinates();
						break;													// Quit looking
						}
					}
				if ((i == _this.segs.length) && (hasImg)) {						// If a nothing found and there are images
					var lat=e.getLatitude();									// Get lat
					var lon=e.getLongitude();									// Get lon
					for (i=0;i<_this.segs.length;++i) {							// Look through list
					  	s=_this.segs[i];										// Point at seg data
						if (s.type != "Image")									// Not an image
							continue;											// Keep looking
						if ((lon > s.lons[1]) && (lon < s.lons[0]) &&			// In lons
							(lat > s.lats[1]) && (lat < s.lats[0])) {			// In lats
							_this.curSeg=i;										// Set index
							_this.dragInfo.seg=shivaLib.map.getElementById(_this.segs[i].id);	// Point at seg
							e.preventDefault();									// Stop popagation
							break;												// Top looking
							}
						}
					}
				if (_this.curSeg != -1) {										// Got one
					_this.Do();													// Set undo	
			    	_this.dragInfo.clicked=true;								// Been clicked on
					_this.dragInfo.lat=e.getLatitude();							// Save click lat
					_this.dragInfo.lon=e.getLongitude();						// Save lon
					_this.DrawMap();											// Refresh map
					_this.DrawControlBar(true);									// Update control bar
					}
				}
 		});

	google.earth.addEventListener(ge.getGlobe(),'mousemove', 				// ON MOUSE MOVE
		function(e) {
			var i,o,lat,lon,num;
			if (_this.dragInfo.clicked) {										// If clicked											
	      		e.preventDefault();												// Stop popagation
	     		_this.dragInfo.dragged=true;									// Drag flag
				var s=_this.segs[_this.curSeg];									// Point at seg
				if (s.lock)														// If locked
					return;														// Quit
				lat=e.getLatitude();											// Get lat
				lon=e.getLongitude();											// Get lon
				if (s.type == "Marker") {										// Marker
					s.lats[0]=lat;												// Set lat
					s.lons[0]=lon;												// Lon
					}
				else if (_this.dragInfo.lat) {									// If clicked on a seg	
					_this.DrawControlDots(false);								// Hide control dots
					var dlat=_this.dragInfo.lat-lat;							// Delta lat
					var dlon=_this.dragInfo.lon-lon;							// Delta lon
					if (s.type == "Box") {										// Box
						s.lats[0]-=dlat;		s.lons[0]-=dlon;				// Set pos
						s.lats[1]-=dlat;		s.lons[1]-=dlon;				// Set pos
						_this.dragInfo.coords.setLatLngAlt(0,s.lats[0],s.lons[0],0);// Set coord
						_this.dragInfo.coords.setLatLngAlt(1,s.lats[0],s.lons[1],0);// Set coord
						_this.dragInfo.coords.setLatLngAlt(2,s.lats[1],s.lons[1],0);// Set coord
						_this.dragInfo.coords.setLatLngAlt(3,s.lats[1],s.lons[0],0);// Set coord
						}
					else if (s.type == "Arrow") {								// Arrow
						s.lats[0]-=dlat;		s.lons[0]-=dlon;				// Set pos
						s.lats[1]-=dlat;		s.lons[1]-=dlon;				// Set pos
						_this.MakeArrow(s.lons,s.lats,s.ewid,_this.dragInfo.coords);	// Redraw arrow
						}
					else if (s.type == "Circle") {								// Circle
						s.lats[0]-=dlat;		s.lons[0]-=dlon;				// Set pos
						s.lats[1]-=dlat;		s.lons[1]-=dlon;				// Set pos
						_this.MakeCircle(s.lons,s.lats,s.ewid,_this.dragInfo.coords);	// Redraw circle
						}
					else if (s.type == "Image") {								// Image
						s.lats[0]-=dlat;		s.lons[0]-=dlon;				// Set pos
						s.lats[1]-=dlat;		s.lons[1]-=dlon;				// Set pos
						var latLonBox=_this.dragInfo.seg.getLatLonBox();		// Get coords	
						var a=s.rot;											// Get 0 -> 360 rot
						if (a > 180) a=-(360-a);								// Convert -180 -> +180
						latLonBox.setBox(s.lats[0],s.lats[1],s.lons[0],s.lons[1],Number(a));	// Set coords						
						}
					else{														// Line/shape
						for (i=0;i<s.lats.length;++i) {							// For each point
							s.lats[i]-=dlat;									// Set lat
							s.lons[i]-=dlon;									// Set lon
							_this.dragInfo.coords.setLatLngAlt(i,s.lats[i],s.lons[i],0); // Set point in line
							}
						}
					_this.dragInfo.lat=lat;										// Reset lat
					_this.dragInfo.lon=lon;										// Lon
					return;														// Quit
					}
				num=Number(e.getTarget().getId().substr(6));					// Get index into line
	    		_this.dragInfo.point=e.getTarget().getGeometry();				// Point coords
	      		_this.dragInfo.point.setLatLng(lat,lon);						// Set new lat/lon
				if (s.type == "Box") {											// Box
					if (num == 0) {												// SE corner
						_this.dragInfo.coords.setLatLngAlt(0,lat,lon,0);		// Set coord
						_this.dragInfo.coords.setLatLngAlt(1,lat,s.lons[1],0);	// Set coord
						_this.dragInfo.coords.setLatLngAlt(3,s.lats[1],lon,0);	// Set coord
						}
					else{														// NW corner
						_this.dragInfo.coords.setLatLngAlt(2,lat,lon,0);		// Set coord
						_this.dragInfo.coords.setLatLngAlt(1,s.lats[0],lon,0);	// Set coord
						_this.dragInfo.coords.setLatLngAlt(3,lat,s.lons[0],0);	// Set coord
						}
					}
				else if (s.type == "Circle") {									// Arrow
					if (num == 1) {												// If center
						lat=s.lats[1];											// Set lat
						lon=s.lons[1];											// Set lon
						}
					else if (!e.getShiftKey()) {								// Not skewing
						var dx=Math.abs(lon-s.lons[1]);							// Get delta
						s.lats[0]=lat=s.lats[1]+dx;								// Set lat
						s.lons[0]=lon=s.lons[1]+dx;								// Set lon
						}
					_this.MakeCircle(s.lons,s.lats,s.ewid,_this.dragInfo.coords);// Redraw circle
					}
				else if (s.type == "Arrow") 									// Arrow
					_this.MakeArrow(s.lons,s.lats,s.ewid,_this.dragInfo.coords);// Redraw arrow
				else if (s.type == "Image") {									// Image
					var latLonBox=_this.dragInfo.seg.getLatLonBox();			// Get coords	
					var a=s.rot-0;												// Get 0 -> 360 rot
					if (e.getAltKey()) {										// Rotating
						a=Number(_this.dragInfo.rot);							// Get rot when 1st clicked
						a+=(400-e.getClientX())/40;								// Add to rot 
						$("#annRot").slider("option","value",s.rot);			// Set slider
						$("#annRot2").val(s.rot);								// Set text box
						s.rot=a;												// Set rot
		      			_this.dragInfo.point.setLatLng(s.lats[num],lon);		// Vertical motion only
						}
					if (a > 180) a=-(360-a);									// Convert -180 -> +180
					latLonBox.setBox(s.lats[0],s.lats[1],s.lons[0],s.lons[1],Number(a));	// Set coords						
					}
				else{															// Point
					_this.dragInfo.coords.setLatLngAlt(num,lat,lon,0);			// Set coord
					_this.dragInfo.index=num;									// Save index
					}
				if (!e.getAltKey()) {											// If not rotating
					if ((!e.getShiftKey()) && (s.type == "Image") && (s.asp)) {	// If maintaining aspect
						lat=((s.lats[1-num]-(s.lons[1-num]-s.lons[num])*s.asp))	// Remake lat
		      			_this.dragInfo.point.setLatLng(lat,lon);				// Set new lat/lon
						}
					s.lats[num]=lat;											// Set lat
					s.lons[num]=lon;											// Get lon
					}
				}
			});

  	google.earth.addEventListener(ge.getGlobe(),'mouseup', 					// ON MOUSE UP
  		function(e) {
			if (_this.dragInfo.clicked) {										// If clicked
  				if ((_this.dragInfo.dragged) && (_this.dragInfo.point) && e.getCtrlKey()) {
 					var i=_this.dragInfo.index;									// Index
 					var p=_this.dragInfo.coords.get(i);							// Point at coord
					var a=_this.GetNearestPoint(p.getLatitude(),p.getLongitude());  // Find closest point
					_this.dragInfo.coords.setLatLngAlt(i,a[0],a[1],0);			// Set coord
					_this.segs[_this.curSeg].lats[i]=a[0];						// Set lat
					_this.segs[_this.curSeg].lons[i]=a[1];						// Set lon
					shivaLib.Sound("click");									// Click
	 				}
  				if (_this.dragInfo.dragged) 	e.preventDefault();				// Stop propagation
		    	_this.dragInfo.clicked=_this.dragInfo.dragged=false;			// Disable drag obj
				_this.DrawControlDots(true);									// Redraw control dots
				 }
	 		});
}

MapScholar_Draw.prototype.onBrowserKeyDown=function(e)						// BROWSER KEY DOWN HANDLER
{
	
	if (e.keyCode == 71) mps.GeoReferenceMap()		////////////////////////////////////////////////////////


	
	
	
	if ((e.keyCode == 8) &&														// Look for Del key
        (e.target.tagName != "TEXTAREA") && 									// In text area
        (e.target.tagName != "INPUT")) { 										// or input
		e.stopPropagation();													// Trap it
     	return false;
    }
}




//////////////////////////////////////////////////////////////////////////////////////////////////
// KML 
/////////////////////////////////////////////////////////////////////////////////////////////////

MapScholar_Draw.prototype.CreateKML=function()								// CREATE KML FILE
{
	var s,i,j,a,id;
	var str="<kml xmlns=\"http://www.opengis.net/kml/2.2\">\n<Document>\n"; 	// Header
	for (i=0;i<this.segs.length;++i) {											// For each seg
		s=this.segs[i];															// Point at it
		id=""+s.type+Math.floor(Math.random()*99999);							// Make random id
		a=Math.round(s.vis*2.55).toString(16);									// Get alpha
		if (a.length == 1)														// If single digit
			a="0"+a;															// Pad 
		if (s.type != "Image") {												// All but image
			str+="<Placemark id=\""+id+"\">\n";									// Placemark
			if (s.text)															// If a label
				str+="\t<name>"+s.text+"</name>\n";								// Add name
			if (s.text2)														// If a label
				str+="\t<description>"+s.text2+"</description>\n";				// Add balloon content
			if (s.type == "Marker") {											// If a marker
				var url=s.url;													// Set icon
				if (!url) 														// No url set
					url="http://www.viseyes.org/mapscholar/img/dotmarker.png";	// Use dot marker
				else if (url == "none") 										// If none
					url="http://www.viseyes.org/mapscholar/img/nomarker.png";	// Use invisible marker
				if (url != "pin") 
					str+="\t<Style>\n\t\t<IconStyle>\n\t\t\t<Icon><href>"+url+"</href></Icon>\n\t\t</IconStyle>\n\t</Style>\n";	// Icon url
				str+="\t<Point>\n\t\t<coordinates>"+s.lons[0]+","+s.lats[0]+",0";	// Coords		
				str+="</coordinates>\n\t</Point>\n</Placemark>\n";				// Close tags
				continue;														// Continue
				}
			str+="\t<Style id=\"sty"+i+"\">\n";									// Style
			str+="\t\t<LineStyle>\n\t\t\t<color>";								// Color start
			if (s.ecol == "") 													// If no color
				str+="00000000";												// No alpha
			else
				str+=a+s.ecol.substring(5,7)+s.ecol.substring(3,5)+s.ecol.substring(1,3);	// ABGR		
			str+="</color>\n";													// Color end
			str+="\t\t\t<width>"+s.ewid+"</width>\n\t\t</LineStyle>\n";			// Width 
			if ((s.type == "Shape") || (s.type == "Box") || (s.type == "Circle") || (s.type == "Arrow")){	// A polygon
				str+="\t\t<PolyStyle><color>";									// Color start
				if (s.col == "")												// If no color
					str+="00000000";											// No alpha
				else
					str+=a+s.col.substring(5,7)+s.col.substring(3,5)+s.col.substring(1,3);	// ABGR		
				str+="</color></PolyStyle>\n";									// Color/poly end
				}
			str+="\t</Style>\n";												// Style end
			if (s.type == "Line")												// If line
				str+="\t<LineString><coordinates>\n";							// Line
			else																// fill
				str+="\t<Polygon><outerBoundaryIs><LinearRing><coordinates>\n";	// Polygon
			if (s.type == "Box") {												// Box
				str+="\t\t"+s.lons[0]+","+s.lats[0]+",0\n";						// NW
				str+="\t\t"+s.lons[1]+","+s.lats[0]+",0\n";						// NE
				str+="\t\t"+s.lons[1]+","+s.lats[1]+",0\n";						// SE
				str+="\t\t"+s.lons[0]+","+s.lats[1]+",0\n";						// SW
				str+="\t\t"+s.lons[0]+","+s.lats[0]+",0\n";						// Last coord
				}
			if (s.type == "Circle") {											// Circle
				coords=this.MakeCircle(s.lons,s.lats,s.ewid,null);				// Make circle into array
				for (j=0;j<coords.length;j+=2)									// Go by 2s
					str+="\t\t"+coords[j]+","+coords[j+1]+",0\n";				// Add coord
				}
			else if (s.type == "Arrow") {										// Arrow
				coords=this.MakeArrow(s.lons,s.lats,s.ewid,null);				// Make arrow into array
				for (j=0;j<coords.length;j+=2)									// Go by 2s
					str+="\t\t"+coords[j]+","+coords[j+1]+",0\n";				// Add coord
				}
			else{																// Lines/polygons
				for (j=0;j<s.lats.length;++j) {									// For each point
					str+="\t\t"+s.lons[j]+","+s.lats[j]+",0\n";					// Add coord
					}
				}
		if (s.type == "Shape")													// If Shape
			str+="\t\t"+s.lons[0]+","+s.lats[0]+",0\n";							// Add last coord
		if (s.type == "Line")													// If line
				str+="\t</coordinates></LineString>\n";							// Line
			else																// fill
				str+="\t</coordinates></LinearRing></outerBoundaryIs></Polygon>\n";
			str+="</Placemark>\n";												// End placemark
			}	
		if (s.type == "Image") {												// Image
			str+="<GroundOverlay>\n";											// Overlay
			str+="\t<Icon><href>"+s.url+"</href></Icon>\n";						// Image
			str+="\t<color>" +a+"ffffff</color>\n";  							// Alpha
			str+="\t<LatLonBox>\n";												// Coords
			str+="\t\t<north>"+s.lats[0]+"</north>\n"; 							// N
			str+="\t\t<south>"+s.lats[1]+"</south>\n"; 							// S
			str+="\t\t<east>" +s.lons[0]+"</east>\n";  							// W
			str+="\t\t<west>" +s.lons[1]+"</west>\n";  							// E
			str+="\t\t<rotation>" +s.rot+"</rotation>\n";  						// Rotation
			str+="\t</LatLonBox>\n";											// Coords
			str+="</GroundOverlay>\n";											// /Overlay
			}
		}
	str+="</Document>\n</kml>";													// End doc
	return str;																	// Return kml
}

MapScholar_Draw.prototype.ParseKML=function(data)							// PARSE KML FILE
{
	var type,s=0,e,i,j,k,o,id,vis;
	var kml=data.kml;															// Point at kml data
	var _this=mps.dr;															// Point at draw module
	if (!mps.controlKey) 														// If not appending (ie. control key is not pressed)
		_this.ClearSegs();														// Clear all segs		
	while (1) {																	// Loop
		j=kml.indexOf("|*GroundOverlay*|",s);									// Next ground
		i=kml.indexOf("|*Placemark",s);											// Next place		
		if ((i == -1) && (j == -1))												// No more
			break;																// Quit
		if (i == -1)	i=1000000000;											// No place
		if (j == -1)	j=1000000000;											// No ground
		o=new Object();															// Add seg
		o.lats=new Array();		o.lons=new Array();								// Coord array
		o.lock=false;															// Don't lock them
		if (j < i) {															// An image
			e=kml.indexOf("|*GroundOverlay*|",j+10);							// Get end
			s=e+10;																// Set new start
			o.type="Image";														// Set type
			o.url=GetTag(j,e,"href");											// Get url
			o.lats[0]=Number(GetTag(j,e,"north"));								// Get N
			o.lats[1]=Number(GetTag(j,e,"south"));								// S
			o.lons[0]=Number(GetTag(j,e,"east"));								// E
			o.lons[1]=Number(GetTag(j,e,"west"));								// W
			o.rot=Number(GetTag(j,e,"rotation"));								// Rot
			GetColor(j,o.vis);													// Get color (to set vis)
			o.vis=vis;															// Get vis
			_this.segs.push(o);													// Add seg
			_this.AddSegsToEarth(_this.segs.length-1);							// Add seg to EDOM
			}
		else{																	// Other seg type
			e=kml.indexOf("|*Placemark*|",i+10);								// Get end
			id=kml.substring(i,i+30);											// Get id
			s=e+10;																// Set new start
			if (((j=kml.indexOf("|*LinearRing*|",i)) != -1) && (j < e)) {		// If a polygon
				lats=[];	lons=[]
				GetCoords(i,e,lats,lons);										// Get all the coords
				o.type="Shape";													// Set type
				if ((lats[0] == lats[1]) && (lats[2] == lats[3]) && (lons[0] == lons[3]) && (lons[1] == lons[2])) {
					o.lats[0]=lats[0];		o.lons[0]=lons[0];					// Add coord			
					o.lats[1]=lats[2];		o.lons[1]=lons[2];					// Add coord			
					o.type="Box";
					}
				else if (id.indexOf("Arrow") != -1)	{							// Is it an arrow?
					o.lats[0]=lats[1]+(lats[5]-lats[1])/2;						// Bisect	
					o.lons[0]=lons[1]+(lons[5]-lons[1])/2;						// Bisect	
					o.lats[1]=lats[0]+(lats[6]-lats[1])/2;						// Bisect	
					o.lons[1]=lons[0]+(lons[6]-lons[0])/2;						// Bisect	
					o.lats[1]=lats[0]+(lats[6]-lats[0])/2;						// Bisect	
					o.type="Arrow";												// Set type
					}
				else if (id.indexOf("Circle") != -1)	{						// Is it an circle?
					o.type="Circle";											// Set type
					o.lats[0]=lats[16];		o.lons[0]=lons[0];					// Add coord			
					o.lats[1]=lats[0];		o.lons[1]=lons[48];					// Add coord			
					}
				else{
					GetCoords(i,e,o.lats,o.lons);								// Get all the coords
					o.lats.pop();												// Remove last lat
					o.lons.pop();												// Lon
					}
				j=kml.indexOf("PolyStyle",i)+8;									// Move to polystyle
				o.col=GetColor(j);												// Get color
				o.vis=vis;														// Get vis
				j=kml.indexOf("LineStyle",i)+8;									// Move to linestyle
				o.ewid=Number(GetTag(j,e,"width"));								// Get width
				o.ecol=GetColor(j);												// Get color
				o.text=GetTag(i,e,"name");										// Get label
				o.text2=GetTag(i,e,"description");								// Get description
				_this.segs.push(o);												// Add seg
				_this.AddSegsToEarth(_this.segs.length-1);						// Add seg to EDOM
				}
			else if (((j=kml.indexOf("|*LineStyle*|",i)) != -1) && (j < e)) {	// Is it a line?
				GetCoords(i,e,o.lats,o.lons);									// Get coords
				o.type="Line";													// Set type
				j=kml.indexOf("LineStyle",i)+8;									// Move to linestyle
				o.ewid=Number(GetTag(j,e,"width"));								// Get width
				o.ecol=GetColor(j,o.vis);										// Get color
				o.vis=vis;														// Get vis
				o.text2=GetTag(i,e,"description");								// Get description
				_this.segs.push(o);												// Add seg
				_this.AddSegsToEarth(_this.segs.length-1);						// Add seg to EDOM
				}
			else{																// Must be a marker
				o.vis=100;														// Alpha
				o.type="Marker";												// Set type
				GetCoords(i,e,o.lats,o.lons);									// Get coords
				o.url=GetTag(i,e,"href");										// Get url
				o.text=GetTag(i,e,"name");										// Get label
				o.text2=GetTag(i,e,"description");								// Get description
				_this.segs.push(o);												// Add seg
				_this.AddSegsToEarth(_this.segs.length-1);						// Add seg to EDOM
				}
			}
		}

	function GetTag(start, end, tag) {											// EXTRACT CONTENTS OF TAG
		var s=kml.indexOf("|*"+tag+"*|",start)+tag.length+4;					// Start of contents
		if ((s == tag.length+3) || (s > end))									// No start	or past end														
			return "";															// Return null
		var e=kml.indexOf("|*"+tag+"*|",s);										// End 
		if ((e == -1) || (e > end))												// No start	or past end														
			return "";															// Return null
		var str=kml.substring(s,e);												// Extract string
		str=str.replace(/\|\*/g,"<");											// Replace <
		str=str.replace(/\*\|/g,">");											// Replace >
		return str;																// Return contents
		}

	function GetColor(start) {												// EXTRACT COLOR
		var s=kml.indexOf("|*color*|",start)+9;									// Start of color
		var e=kml.indexOf("|*color*|",s);										// End 
		var col=kml.substring(s,e);												// Extract color
		if ((col.length < 8) || (col == "00000000"))							// Too short or off
			return "";															// Return none
		vis=parseInt(col.substr(0,2),16)/2.55;									// Get it
		return "#"+col.substring(6,8)+col.substring(4,6)+col.substring(2,4);	// ABGR -> RGB
		}

	function GetCoords(start, end, lats, lons) {							// EXTRACT COORDS
		var i;
		var v=GetTag(start,end,"coordinates").split(",0");						// Get pairs
		for (i=0;i<v.length-1;++i) {											// For each pair
			lons[i]=Number(v[i].split(",")[0]);									// Get lon
			lats[i]=Number(v[i].split(",")[1]);									// Get lat
			}
		return v.length-1;														// Return number coords
		}
	
}

MapScholar_Draw.prototype.Do=function()										// SAVE UNDO
{
	var i,o,a=new Array();
	_this=mps.dr;															// Point at draw module
	for (i=0;i<_this.segs.length;++i) 											// For eqach seg
		a.push($.extend(true,{},_this.segs[i]));								// Deep copy 
	_this.undos.push(a);														// Add to end of list
	if (_this.undos.length > _this.maxUndo)										// If beyond limit
		_this.undos.shift();													// Pop off 1st		
}

MapScholar_Draw.prototype.Undo=function()									// PERFORM UNDO
{
	_this=mps.dr;																// Point at draw module
	if (!_this.undos.length)													// If  no undos
		return false;															// Return didn't undo
	while (_this.segs.length)													// For each seg
		_this.RemoveSeg(0);														// Remove it
	_this.curSeg=-1;															// No seg selected
	var s=_this.undos.pop().slice(0);											// Get array of segs
	for (i=0;i<s.length;++i) 													// For each seg
		_this.segs.push($.extend(true,{},s[i]));								// Deep copy 
	_this.AddSegsToEarth();														// Add them back
	return true;																// Return did undo
}
