# Module lifecycle and configuration

So far, all that we have learned was about the world inside a module. All that we have learned about a ***Module*** was this: 

Call a constructor with a name and it somehow magically enables you too bootstrap an application that can have some controllers and 

```javascript 
var someApp = angular.module('someApp', []); 
```

But there has to more that that, right? It indeed is, the main functionality (at least from our point of view) of a module is to provide a set of `run` and `configuration` blocks that get applied during the bootstrap process, before the actual app starts!


## Module Configuration and Run block

To get started, I want you to pay close attention to the foloowing qoutes from the offical documentation:

- **Configuration blocks** - get executed ***during the provider registrations and configuration phase***. Only providers and constants can be injected into configuration blocks. This is to prevent accidental instantiation of services before they have been fully configured.
- **Run blocks** - get executed ***after the injector is created*** and are used to kickstart the application. Only instances and constants can be injected into run blocks. This is to prevent further system configuration during application run time.

The key point here is about a mysterious component called `injector`. We prevent going into too deep boring detail, so just think of injector as a component that was the duty of preapring any service for being injected. This means that when you write:

```javascript
app.controller('name', funciton($scope, $http, someService) {
	// the injector takes care of instantiating $http service and someService ( if needed ) and return an `instance`
})
```

Now let's go back to the definition. 

- The configuration block is applied ***during the provider registrations and configuration phase***.
- The run block is applied ***after the injector is created***. 

This can be translated into this: 

- The configuration block is applied for configuring providers, not services themself
- The run block is applied ***after the injector is created***. 

And logn story, from your point of view, what matters is that: You can not inject your own services and bootstrap them or configure them inside a configuration block, but run blocks can be used for this purpose. 

So what is the point of having a `configuration` block if service can cont be used inside them? Well there is a reason for everything! 
Ther are a set of very inportant objects in angular named `Providers`, we mentioned them in the early chapters briefly and said they are like a service, but it's like a paretn to all of other service types. It can create objects and return them, but services are a singleTon object that just expose a set a functions or values. To abstarct this, Angular iteslf has

- $http Service
- $http Provider 

and Http provider is actually what creates the `$http` service and passes is out, when it is being injected. 

And recall from above, ***Providers*** can be configured inside `configuration`. As an example we will see in this chapter that there is a good probability that you want to modify something insde the `$http`, say you want to add a header to all of the outgoing requests. `$httpProvider` can be used and configured inside configuration block to do this. 


## Modifying HTTP Provider 
As mentioned above, it is verry likely that you wish to add a specific value to all of your http request. Json Web Tokes, for example, are usually sent to server inside a specific header, like amny other authenthication mechanisms. To achive this, you can either app them manually: 

```javascript
$http({
	method: 'GET',
	headers: {'additional-header': 'hello $http'} ,
	...
})
```

To each request, which is madness! 

Another cleaner way might be to write a service to manage http requests. the controllers will ask this service to make the call, and this service will know how to send the request. A genral markup for this service could be something like this: 

```javascript 
app.factory('cutomHttp', function($http) {
	return : {
		get: function(url, data) {
			$http({
				method: "GET",
				headers: {'something-for-all': 'data'},
				data: data, 
				url: url
			})
				.then(
					function() {
						// do something with promise
					}, 
					function() {
						// do something with promise 
					}
				)
		}
	}
	
})
```

Allthough such service, if implemented correctly (the above code is far from being correct, it was meant to just give you a sense!) could be something to rly on, I don't personally suggest this because Angulr provides a way to achive this is a much more sophisticated way. 

### HTTP Interceptors

Angular uses a pipeline for both sending and receiving a http requets. This means that each http request, before being sent out, will pass through an array of functions, and same story when being received. each of these functions inside the array (aka *Interceptr*) have access to the data associated with the request, its configuration such as url and headers. you can even use these interceptors as filters, check some conditions and if they are met, change the data being sent with the request, or even change its url! 

Lets see these interceptors is action. 

Add the following `.config()` block to your application, immediatly after defining `myApp`:

```javascript
myApp.config(function ($httpProvider) {
  console.log($httpProvider);
})
```

As mentioned before, `$httpProvider` is the provider responsible for creating `$http` and other realted services, and configuring them. 

You can see in your logs that an `interpectors` array does live inside `$httpProvider`, but so far, it is empty. 

Let's fill this array! Any intercptor added to this array must met the following conditions: 

- It must be a factory (there are some backdoor ways to mock a service, but let's think about the right way here!)
- The factory can expose one or more of the following keys as a public API :
  1. `request`: a function called right after the `$http` service has been given an order to send a request. At this stage, you can change the request data, configuration or even cancle it.
  2. `requestError`: this function only catches requests that **could not be send** (this is different from **Coming back with a response error**). Rejecting a request from being sent out can happen by other interceptor.
  3. `response`: In contrast to `request` key,  this function gets called right after the resonse has arrived. The response object can be modified in the function and then returned for further usage.
  4. `responseError`: A response migth be catched by the responseError either because of being rejected by previous response interceptors, or because of any server errors, which is equeal to having a response statusCode, like 500 or 404.

Let's create an interctor, in the simplest way possible and see what we can do with it: 

```javascript
myApp.factory("customInterceptor", function() {
	return {
		request: function(config) {
			console.log('request : ', config);
		} ,
		response: function(response) {
			console.log('response', response);
			return response
		},
		responseError: function(response) {
			console.log('responseError', response); 
			return response
		}
	}
})

// And then to apply this interceptor

myApp.config(function ($httpProvider) {
	$httpProvider.interceptors.push('customInterceptor')
})
```

Now go and play arounf with the github serach that we had before. Since we are modifying the `$httpProvider` and our requests were made using `$http`, the intercptor array will apply to all of them. you should also notice how `responseError` gets called when we search for a username that does not exist, since the serach requests returns with a 404 error status.

One important key to notice here is that we did not injected `customInterceptor` into the ``.config()` block, ***because we weren't allowd to do so***! Config loops run before all of ther sevices and factories are initialized, as you remember. Instead, we just passed a name to the `$httpProvider.interceptors.push()` so that later on, when an actual instance of `customInterceptor` is created, it can be used.

### Interceptors for authentication 

Using auth interceptor for authentication should be now clear to you. We can't cover this entirely now, because we need an actual REST API with authentication and so on and so on! But at least we can talk about it briefly. 

Assume that you have a `.factory()`, name **AuthService** and this service checks the localStorage of user browser to see if an access token exists or not, and perform teken refreshing operation etc. 

The simplest form of adding a token to all of your http request be done like this: 

```javascript
myApp.factory("customInterceptor", function(AuthService) {
	return {
		request: function(config) {
			if ( AuthService.hasToken ) {
				config.headers.auth = AuthService.getToken() ; 
			}
			return config ;
		} ,
		...
	}
})
```

### Interceptors for error handling 

One very usefull application of interceptors is global error handling.
Consider a larger application, which many many AJAX calls, and each of them could go wrong for different reason. The least that you want to do is to have an error box, a modal informing the user that some error has heppened. 

The Horrible way to do this would be to repeat the same operation on each error callback 

```javascript 
$http.get(url1).then(
	function suucess() {}, 
	function error() {
		// some sort of error handling
	}
)

$http.get(ur2).then(
	function suucess() {}, 
	function error() {
		// again
		// some sort of error handling
	}
)

// you are going to hell! 
```

If you want to act cleaver, you would create a general error handling service/sirective - or just a function - to avoid code duplication in this scenario. This is a good solution. I am not against it and have used it personally. 

But if you even want to make thing more easier, and more clean, you sould use the `responseError` key inside the interceptor. It's pretty clear how to do this, but just to remind you about it, recall our last plain interceptor. As you migh have inspected, any error such as 404 etc. will be caught inside `responseError`: 

```javascript 
myApp.factory("customInterceptor", function() {
	return {
		responseError: function(response) {
			// show an error message here, displaying some serve side errors or status code or .. 
			return response
		}
	}
})
```

Cool thing here is that, if this level of error handling is enough, you can even ommit handling the error callback of `$http()`. 

We can take this even one step further and change the callback that will be called after interceptors pipeline is over, in other words, even when a request has came back with an error status code, we can give it another try (in any way, think of a simple resend in the simplest case) and if it succeeds, pass it to the success callback. 

To achive this, we should get familiar with a library used by Angular to handle promises, `$q`. Before going to the next section about this library, Let's stop for a second and think about how we are placing our application components (by component I simply mean just a pice of code doing specific task). We mentioned before that the error handling could be used inside the callback of a `$http` call, even in a smart way. But we introduced another ***better*** way. Same story applies to request recovery or retry. We ***COULD*** simply give a request a second chance inside the error callback, whats wrong with that? *nothing in particular*. It is not going to be some evil code that will crash definitly and so forth. But let me say it this way: ***it wouldn't be a clean and beautiful code that you're going to love forever***. Why is that? I have mentioned before that codes with a specific task should be seperated in Angular. we enforced using a service for making http calls, not the controller, like ten time until now. Here, we are seperating the code for the same reason again. 

The controller's duty is to **controll the data on the UI**. So we moved the http calls to a service. could we make a http call inside the controller? ***Yes but it would ugly as hell***.

And now

The http requests's duty is to make a call with appropiate payload, and return it to someone, if the response comes. So we move the logic about *showing error message or retry* (which are irrelavent) away. could we do error handling inside an http callback? ***Absoluatly, but it would be ugly as hell, again!***

We'll discuse these issues about module and component cohesion and coupling later on in a seperate chapter. 

### Perform Async operations using $q

We breifly described `$q` before as a tool for creating promises. he also mentioned how to use a promise (with `.then()`) and saw it in action with `$http`. Now, we're going to see how to create promises, or change their behaviours. 

To recap on the opertion of a promiss, consider a simple mock async operation with `timeOut`. The function simple takes some time to finish. if this function whants to leverage the promise capabilities, it should:

1. create a deferred object and return in at soon as possible (aka. `$q.defer()`). 
2. It sould then perform its operation, and when desired, call one of the methods of the defered object, `.reject()` or `.resolve()`. 

The returned deferd object, is actually the object that has that `.then()` method, which we saw alot! 

To make this more clear, consider the following snippet: 

```javascript 
// assume that Angular's $q is available 

var someAsyncFn = function (name) {
	// create the promise object, aka the deffered object
	var promise = $q.defer() ;
	
	// prepare for async operatio
	setTimeout(funciton() {
		if ( canHello ) { // some condition, trivial
			prmise.resolve('resolve message') ;
		} else {
			prmise.reject('reject reason'); 
		}
	}, 10000); 
	
	// this promise will have a .then method!
	// note that we return the pormise, 
	// but to timeOut has not yet executed!
	return promise
}

// to call Async

var deferedPromise = someAsyncFn('Ted'); 

deferedPromise.then(
	function (message) { /* note that the message that we passed to .resolve() will come here! */ }, 
	function (reason) {}
)

```

And that's it with promises! although there is more to it than this, but this is enough to get you started at this point. 

Another good news is that now, you almost compleatly know how and why each of the callbacks of the promise after an http call gets invoked. So the `$http` will return a promis, and this promise will get rejected or resolved somewhere along the way.. intresting .. 

Let's reveal another piece of information, and after that, I will to see a lightbulb above your head, indicating that you have suddenly understood how to manipulate the promise callbacks, in other words, how to make pass a request from the `responseError` to `successCallback` (aka first callback) of the http promise. Here is goes: 

A qoute from AngularJS website : 

> request: interceptors get called with a http config object. The function is free to modify the config object or create a new one. ***The function needs to return the config object directly, or a promise containing the config or a new config object***. 

(The bolded rule applies for all four of the `request`, `response`, `reposneErro`, `requestError`); 

You saw that? This means that we must not always return the config object, instead we can return a promise, and if we later call the resolve on that promise? or reject it? you got my point!

A psudo code to show this more realistic could be: 

```javascript 
myApp.factory("customInterceptor", function($q, AuthService) {
	// we inject the $q service
	// and an Imaginary service called AuthServiec
	// like the other example about authorization header
	
	return {
		responseError: function(response) {
			// since we know that session expiration is a common 
			// situation, we check it here
			
			if ( response.statusCode == 401 ) { // 401 Unauthorized 
				// create a deffer object 
				var promise = $q.defer() ;
				
				// this refreshing may take some time!
				AuthService.tryRefreshingSession( function (err, success) {
					// reject or resolve the promise.
					if ( err ) {
						promise.reject(err) ; 
					}
					else {
						promise.resolve(success) ; 
					}
				})	
				
				return promise; 
			}
			
			else {
				// the normal situation 
				return response; 
			}
		}
	}
})

```

If this code seems too confusing, you could alsi test this with a much more simpler case! go the interceptor that we added with logging to our github search. Implement the following `responseError`: 

```javascript
responseError: function (response) {
      // to test things, we pass the responseError to 
      // success callbacl by calling resolve
      console.log('responseError', response);
      return $q.resolve(response);
}
...

```

Place some logs after inside `$http({}).then()` and see for yourself that whene you search a username that does not exist, and status code is 404, which callbacl gets called? since we are resolving all failed requests, the error callback will not be called. 

### Further reading and challenges and the code

- Create a `timestamp` http interceptor and mease the time it takes to perform each of the requests.
- A very good example of [promise chain](http://www.bennadel.com/blog/2777-monitoring-http-activity-with-http-interceptors-in-angularjs.htm) by Ben Nadel.


## Routing Config 

A very common example of using `configuration` block is to set up some routes. Angular uses client side routing to navigate user through different pages inside an application. It's clear that this routing is different from the original browser routing using anchor tags, and the key difference is ***not involving any refreshing***. This method follows the ***Single page application*** guidline, avoiding multiple page refreshing while the user is navigating and working with the application. 


### Further reading and challenges and the code

