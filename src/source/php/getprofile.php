<?
try {
	$db = new PDO('sqlite:tweets_DB.sqlite');
	$db -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$statement=$db->prepare('SELECT user_name, name, profile_image_url, location, description, url FROM profiles');
	$statement->execute();
	$results=$statement->fetchAll(PDO::FETCH_ASSOC);
	$json=json_encode($results);
	
	echo $json;

	$db = NULL;

}

catch(PDOException $e){
	print 'Exception : '.$e->getMessage();
}
?>