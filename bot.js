console.log('Bot has started!');
var Twit = require('twit');  
const config = require('./config.js');

var Twitter = new Twit(config.c);

// find latest tweet according the query 'q' in params
var retweet = function(retweetRemaining) {  
    var params = {
        q: config.hashtag,  // REQUIRED
        result_type: 'recent', 
        lang: 'en'
    };
	
    Twitter.get('search/tweets', params, function(err, data) {
		//console.log(data.statuses[0].user);
		var tweetSentCount = 0;
		// if there no errors
		if(!err){
			var sizeOfResponses = data.statuses.length;
			console.log(Date() + ' Received ' + sizeOfResponses + ' tweets');
			if(sizeOfResponses > 0){
				for (count = 0; count < sizeOfResponses; count++) {
					//console.log('processing tweets: ' + sizeOfResponses + ' on run: ' + count);
					if(count < retweetRemaining && data.statuses[count].user.screen_name != 'lasshold'){
					
						var p = {
							id:	data.statuses[count].id_str
						};
						
						
						(function(c,d){
							Twitter.get('statuses/retweeters/ids', p, function(err, ids ){
								if(ids.ids.includes(d.statuses[c].user.id)){
									console.log(Date() + ' something contained');
									// grab ID of tweet to retweet
									var retweetId = d.statuses[c].id_str;
									// Tell TWITTER to retweet
									Twitter.post('statuses/retweet/:id', {
										id: retweetId
									}, function(err, response) {
										if (response) {
											console.log(Date() + ' Retweeted!!!');
											tweetSentCount++;
										}
										// if there was an error while tweeting
										if (err) {
											console.log(Date() + ' Something went wrong while RETWEETING... Duplication maybe...');
											console.log(err);
										}
									});
								}
								else{
									//console.log('tweet already retweeted');
								}
							});
						})(count, data);
					}
				}
			} 
			else { 
			console.log(Date() + ' Nothing to Retweet');
			}
		}
		else{
			console.log(Date() + ' Something went Wrong while searching');
		}
		console.log(Date() + ' Sent     ' + tweetSentCount + ' tweets');
    });
}

var ratelimit = function() {
	var params = {};
	Twitter.get('application/rate_limit_status', params, function(err, data){
		var retweetLimit = data.resources.statuses['/statuses/retweets/:id'].limit;
		var retweetRemaining = data.resources.statuses['/statuses/retweets/:id'].remaining;
		var remainingSearch = data.resources.users['/users/search'].remaining;
		console.log(Date() + ' retweetLimit: ' + retweetLimit + '   retweetRemaining: ' + retweetRemaining + '   search remaining: ' + remainingSearch);
		
		if(retweetRemaining > 0 && remainingSearch > 0){
			retweet(retweetRemaining);  
		}
	});
	
}

ratelimit();

setInterval(ratelimit, 60000);
