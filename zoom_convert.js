// Converts Google Earth range value to open layers resolution
// "range" is the altitude of the GE camera
// "width" is the horizontal size of the GE window, in pixels
// "fov" is the horizontal FOV of the GE window in degrees (default value is 60)
// unit_scale is the ratio of GE range units to OL map units (by default meters for both)
function range_to_resolution(args)
{
    var range = args.range;
    var width = args.width;
    var fov = args.fov || 60;
    var unit_scale = args.unit_scale || 1;
    
    return((Math.tan(fov*(Math.PI/360))*2*range)/(width*unit_scale))
}



// Converts Google Earth range value to open layers resolution
// "range" is the altitude of the GE camera
// "width" is the horizontal size of the GE window, in pixels
// "fov" is the horizontal FOV of the GE window in degrees (default value is 60)
// unit_scale is the ratio of GE range units to OL map units (by default meters for both)
function resolution_to_range(args)
{
    var resolution = args.resolution;
    var width = args.width;
    var fov = args.fov || 60;
    var unit_scale = args.unit_scale || 1;
    
	return((resolution*width*unit_scale)/(2*Math.tan(fov*(Math.PI/360))))
}
 
