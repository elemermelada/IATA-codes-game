<?php 
$new_game = file_get_contents('php://input');
$leaderboard_json = file_get_contents('leaderboard.json');
$leaderboard = json_decode($leaderboard_json, true);


array_push($leaderboard, $new_game);
$leaderboard_json = json_encode($leaderboard, JSON_PRETTY_PRINT);
file_put_contents('leaderboard.json', $leaderboard_json);
?>