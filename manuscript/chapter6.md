# Refactoring form a large scale application

In the previous chapters we learned a lot about Angular, but there was one main flow. It was mostly about controllers! this is not a bad thing at first, but soon or late, when your project scales into a real deal, a real Webapp, you're going to face a problem: You'll end up with an some fat *controller-oriented* code and if you are hoping for some clean, testable and maintainable code, you're going to want to change that. Collaboration becomes suddenly hard, scope functions and properties become too coupled and changing anything might cause the app to crash and that when you are doomed to refactor. 

This happens mostly because all tutorials on Angular, almost always start with controllers, and the developer learning suddenly finds himself/herself with a tool - *controller* - that almost everything can be implemented using it and says: 

Hey! this controller thing is like magic! I can do everything with it, why bother implementing a service or a directive?

To describe it, aside from scalibility problem, overusing controllers can be viewed as eating a meal, but only using a fork! That's not logical, right? 

To explain even more, recall to the last chapter where we argued about implementing something using a seprate controller, or just use to `rootScope` to get it working. This argument is valid, but here we are thinking about eveything from one step higher, we are thinking a little bigger! **We are arguing what should be implemented using controllers/rootScope, and what shouldn't**.

This chapter is going to be rather short, but understanding is very important, it somehow gaurantees that you can use the knowledge you gave learned so far, properly. 

## General rule: Controllers are meant to controll the UI 


## Serperating data loginc into Services

## Using Directives for reusable components

## Using constants for cleaner code

## Module level scaling 