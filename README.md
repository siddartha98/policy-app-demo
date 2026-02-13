# Policy App Demo
This is a .NET web application with an In-Browser lightweight UI in ReactJsx. 
This purpose of this application is to demo a functional RESTful API solution developed in fullstack with in-memory database populated via data seeding, 
showcase the functionality and solution architecture/designing. 
The core functionality of this demo application is perform simple CRUD operations.


Additional notes for interviewers:
This README briefly describes the solution. The project demonstrates a minimal full-stack pattern:
- A small ASP.NET Web API exposing policy endpoints backed by an in-memory EF Core DbContext.
- A static React-based UI (served from wwwroot) that calls the API to list and cancel policies.
The goal is to show API design, dependency injection, basic domain modeling, and simple UI integration without persistent storage.
- If you wish to clone the repository and run the demp app. During application build, if you run into CS1061 error
related to AddSwaggerGen, UseSwagger, and UseSwaggerUI - missing packages, then install NuGet package Swashbuckle.AspNetCore and rebuild.