<?
require_once('TwitterAPIExchange.php');
$settings = array(
    'oauth_access_token' => "69153072-tfTZChCMBpa6D0MofgMoi44S9xiytGo1HDRr4IYym",
    'oauth_access_token_secret' => "grSvJDe2Fyfu61649anJXNweeAebO5rjtTu6luMlIoo3z",
    'consumer_key' => "hjJAjp3I7gLaI7RCoEF0OtAQe",
    'consumer_secret' => "LLvN6v5Va05WcRny2MgnYaekMu3VKZAX1Pn0b1DShHM3SZEvKA"
);

$url = 'https://api.twitter.com/1.1/search/tweets.json';
$getfield = '?q=%23LideresLatam+OR+%23&iacute;deresLatam+OR+%23Lid&egrave;Latam&count=100';
$requestMethod = 'GET';

$twitter = new TwitterAPIExchange($settings);
$response = $twitter->setGetfield($getfield)
    ->buildOauth($url, $requestMethod)
    ->performRequest();

$check = json_decode($response);

if($check){
	echo $response;
}else{
	echo '{"statuses":[]}';
}

?>