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

### Perform Async operations inside config using $q

### Further reading and challenges and the code

- Create a `timestamp` http interceptor and mease the time it takes to perform each of the requests.


## Routing Config 

A very common example of using `configuration` block is to set up some routes. Angular uses client side routing to navigate user through different pages inside an application. It's clear that this routing is different from the original browser routing using anchor tags, and the key difference is ***not involving any refreshing***. This method follows the ***Single page application*** guidline, avoiding multiple page refreshing while the user is navigating and working with the application. 


### Further reading and challenges and the code

