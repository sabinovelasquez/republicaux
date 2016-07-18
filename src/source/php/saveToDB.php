<?
require_once('TwitterAPIExchange.php');
try {
	$db = new PDO('sqlite:tweets_DB.sqlite');
	$db -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$accounts = array(
		'palpeeto',
		'BigoteUX',
		'laconipalma',
		'jicalderon',
		'joyceribot',
		'felipeonate'
	);
	$hash = 'republicaux';
	$quant = 50;

	$settings = array(
	    'oauth_access_token' => "69153072-xKyq1s5FqtQQDQozM252WyZi9OO3xN972QIY5Fkd9",
	    'oauth_access_token_secret' => "MeUzuVjj2kpYnlxzQnpoz8gqVoGz7Hl728u6Ee4eEapEG",
	    'consumer_key' => "pen5upl9F5bxzmC9yvZQ8odAF",
	    'consumer_secret' => "ucArN90QXfeduOK7kNTW44170tKaZY6CG8BSZqRi72EUbznYwU"
	);
	$twitter = new TwitterAPIExchange($settings);

	$url = 'https://api.twitter.com/1.1/search/tweets.json';
	$user_url = 'https://api.twitter.com/1.1/users/show.json';

	$getfield = '?q=';
	$requestMethod = 'GET';

	$db->exec("CREATE TABLE IF NOT EXISTS profiles (id INTEGER PRIMARY KEY, user_name TEXT, name INTEGER, profile_image_url TEXT, location TEXT, description TEXT, url INTEGER, UNIQUE(user_name))");
	$profile = $db->prepare("INSERT OR REPLACE INTO profiles (user_name, name, profile_image_url, location, description, url) VALUES (:user_name, :name, :profile_image_url, :location, :description, :url)");	
	
	for ($i = 0, $count = count($accounts); $i < $count; $i++){
		$user_field = '?screen_name='.$accounts[$i];
		$json_user =  $twitter->setGetfield($user_field)
		                 ->buildOauth($user_url, $requestMethod)
		                 ->performRequest();

		$user = json_decode($json_user);

		$profile->bindParam(':user_name', $accounts[$i]);
		$profile->bindParam(':name', $user->name);
		$profile->bindParam(':profile_image_url', $user->profile_image_url);
		$profile->bindParam(':location', $user->location);
		$profile->bindParam(':description', $user->description);
		$profile->bindParam(':url', $user->url);
		
		$profile->execute();

	    $getfield .= 'from%3A'.$accounts[$i];
	    if($i != count($accounts) -1 ){
	    	$getfield .= '+OR+';
	    }
	}

	$getfield .= '%23'.$hash.'&count='.$quant;
	
	$response = $twitter->setGetfield($getfield)
	    ->buildOauth($url, $requestMethod)
	    ->performRequest();

	$json = json_decode($response);
	$totaljson = count($json->statuses);

	$db->exec("CREATE TABLE IF NOT EXISTS statuses (id INTEGER PRIMARY KEY, id_status INTEGER, created_at TEXT, message TEXT, retweet_count INTEGER, favorite_count INTEGER, username TEXT, name TEXT, UNIQUE(id_status))");
	$stmt = $db->prepare("INSERT OR REPLACE INTO statuses (id_status, created_at, message, retweet_count, favorite_count, username, name) VALUES (:id_status, :created_at, :message, :retweet_count, :favorite_count, :username, :name)");	
	
	foreach ($json->statuses as $tweet) {
		$stmt->bindParam(':id_status', $tweet->id_str);
		$stmt->bindParam(':created_at', $tweet->created_at);
		$stmt->bindParam(':message', $tweet->text);
		$stmt->bindParam(':retweet_count', $tweet->retweet_count);
		$stmt->bindParam(':favorite_count', $tweet->favorite_count);
		$stmt->bindParam(':username', $tweet->user->screen_name);
		$stmt->bindParam(':name', $tweet->user->name);
		$stmt->execute();
	}

	echo "<table border=1>";
	echo "<tr><td>id_status</td><td>name</td><td>message</td><td>favorite_count</td></tr>";
	$result = $db->query('SELECT * FROM statuses ORDER BY id_status DESC');

	foreach($result as $row){
		echo "<tr><td>".$row['id_status']."</td>";
		echo "<td>".$row['name']."</td>";
		echo "<td>".$row['message']."</td>";
		echo "<td>".$row['favorite_count']."</td></tr>";
	}

	echo "</table>";

	echo "<table border=1>";
	echo "<tr><td>user_name</td><td>name</td><td>description</td><td>url</td></tr>";
	$result = $db->query('SELECT * FROM profiles');

	foreach($result as $row){
		echo "<tr><td>".$row['user_name']."</td>";
		echo "<td>".$row['name']."</td>";
		echo "<td>".$row['description']."</td>";
		echo "<td>".$row['url']."</td></tr>";
	}

	echo "</table>";
	$db = NULL;

}

catch(PDOException $e){
	echo 'Exception : '.$e->getMessage();
}
?>