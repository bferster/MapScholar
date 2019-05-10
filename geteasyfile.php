<?
	header('Cache-Control: no-cache, no-store, must-revalidate'); 
	header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
	header('Pragma: no-cache'); 
	require_once('config7.php');

	$id=mysqli_real_escape_string($last,$_GET['id']);
	if (!is_nan($id)) {
		$query="SELECT * FROM easyfile WHERE id = '$id'";
		$result=mysqli_query($link, $query);						
		}
	else
		$result=false;
	if (($result == false) || (!mysqli_num_rows($result)))
		echo "Can't load file!";
	else{
		$row=mysqli_fetch_assoc($result);
		$type=$row["type"];
		$data=$row["data"];
		echo "easyFileDataWrapper(\n";	
		if ($type == "KML") {
			$data=str_replace("\"","'",$data);	
			$data=str_replace("</","|*",$data);	
			$data=str_replace(">","*|",$data);	
			$data=str_replace("<","|*",$data);	
			$data=str_replace("\r\n","",$data);	
			$data=str_replace("\n\r","",$data);	
			$data=str_replace("\n","",$data);	
			$data=str_replace("\t","",$data);	
			echo "{ \"kml\":\"";
			}
		echo $data;
		if ($type == "KML")
			echo "\"}";
		echo "\n)";	
		}
	mysqli_free_result($result);								// Free
	mysqli_close($link);										// Close session
?>

