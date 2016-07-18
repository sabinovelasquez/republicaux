<?
try {
	$db = new PDO('sqlite:tweets_DB.sqlite');
	$db -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$statement=$db->prepare('SELECT created_at, message, retweet_count, favorite_count, username, name FROM statuses ORDER BY id_status DESC');
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