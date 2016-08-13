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
- $httpProvider 

and Http provider is actually what creates the `$http` service and passes is out, when it is being injected. 

And recall from above, ***Providers*** can be configured inside `configuration`. As an example which we see in this chapter, there is a good probability that you want to modify something insde the `$http`, Say you want to add a header to all of the outgoing requests. `$httpProvider` can be used and configured inside configuration block to do this. 


## Routing Config 

## HTTP Interceptor 
