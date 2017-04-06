console.log('Bot has started!');
var Twit = require('twit');  
var config = require('./config.js');

var Twitter = new Twit(config);
var stream = Twitter.stream('user');

stream.on('follow', followed);

function followed(event) {
	console.log("followed events!");
	var name = event.source.name;
	var screenName = event.source.screen_name;
	tweetIt('@' + screenName + ' Thanks for the follow!');
}

function tweetIt(txt) {
	var tweet ={
		status: txt
	};
	Twitter.post('statuses/update', tweet, tweeted);
}

function tweeted(err, data, response) {
	if (err) {
		console.log("Something went wrong!");
	} else {
		console.log("It worked!");
	}
}
// find latest tweet according the query 'q' in params
var retweet = function() {  
    var params = {
        q: '#webdev, #IoT',  // REQUIRED
        result_type: 'recent', 
        lang: 'en'
    }
    Twitter.get('search/tweets', params, function(err, data) {
      // if there no errors
        if (!err) {
          // grab ID of tweet to retweet
            var retweetId = data.statuses[0].id_str;
            // Tell TWITTER to retweet
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                if (response) {
                    console.log('Retweeted!!!');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('Something went wrong while RETWEETING... Duplication maybe...');
                }
            });
        }
        // if unable to Search a tweet
        else {
          console.log('Something went wrong while SEARCHING...');
        }
    });
}

// grab & retweet as soon as program is running...
retweet();  
// retweet in every 50 minutes
setInterval(retweet, 1800000);

// FAVORITE BOT====================

// find a random tweet and 'favorite' it
var favoriteTweet = function(){  
  var params = {
      q: '#webdev, #IoT',  // REQUIRED
      result_type: 'recent',
      lang: 'en'
  }
  // find the tweet
  Twitter.get('search/tweets', params, function(err,data){

    // find tweets
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet);   // pick a random tweet

    // if random tweet exists
    if(typeof randomTweet != 'undefined'){
      // Tell TWITTER to 'favorite'
      Twitter.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
        // if there was an error while 'favorite'
        if(err){
          console.log('CANNOT BE FAVORITE... Error');
        }
        else{
          console.log('FAVORITED... Success!!!');
        }
      });
    }
  });
}
// grab & 'favorite' as soon as program is running...
favoriteTweet();  
// 'favorite' a tweet in every 60 minutes
setInterval(favoriteTweet, 1800000);

// function to generate a random tweet tweet
function ranDom (arr) {  
  var index = Math.floor(Math.random()*arr.length);
 return arr[index];
}  

