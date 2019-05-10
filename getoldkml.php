<?php
	header('Content-Type: text/xml');
	header('Cache-Control: no-cache, no-store, must-revalidate'); 
	header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
	header('Pragma: no-cache'); 
	require_once('config7.php');

	$id=mysqli_real_escape_string($link,$_GET['id']);
	if (!is_nan($id)) {
		$query="SELECT * FROM easyfile WHERE id = '$id'";
		$result=mysqli_query($link, $query);						
		}
	else
		$result=false;
	ob_clean();
	if (($result == false) || (!mysqli_num_rows($result)))
		echo "Can't load file!";
	else{
		$row=mysqli_fetch_assoc($result);
		$r=$row["data"];
		if (!strstr($r,"<?xml"))
			echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
		echo $r;
		}
	mysqli_free_result($result);								// Free
	mysqli_close($link);										// Close session

?>