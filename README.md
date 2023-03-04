# JournalApp - Refactored and Design Update
 Jounalling App
 

A journalling project that I made while experiementing and learning about Node and Electron.

## [See YouTube Video Walthrough](https://youtu.be/YHcCa2SDqf0)

<!-- Also be sure to see 
## [YOUTUBE WALKTHROUGH](https://www.youtube.com/watch?v=2LTY80dYC0g&t=81s) -->

## Tables of Contents
* [Background](#background)
* [Images](#images)
* [Technologies](#technologies)
* [Requirements to run the project](#requirements-to-run-the-project)
* [Setup](#setup)
* [Running the project](#running-the-project)
* [Project Shortcomings](#shortcomings)
* [Modifications](#modifications)
* [Things learned](#things-learned)
* [Trello Board Original Project](https://trello.com/b/e8hwRTpR/patientapp) & [Trello Board Current Project](https://trello.com/b/pI50op1x/patient-health-rewrite)

## Background
I wanted to create an app that would allow people to journal. That meant having a system that interacted with the computers file system directly. Hearing about Node, and also being familiar with JavaScript, it became an ideal choice to work with Node and Electron to create this desktop applicaiton (as Node allow you to run JS on the computer system natively rather than just in the browser and electron renders HTML like a browser to produce app with Node.)

## Images

## Version 3
<img width="922" alt="image" src="https://user-images.githubusercontent.com/38586415/127141972-c9b7d851-8dd8-4587-b72e-49c0f8d9d7d8.png">


## Version 2
<img width="927" alt="image" src="https://user-images.githubusercontent.com/38586415/123151514-71b91700-d45b-11eb-9bc7-6f81ef35a10e.png">

## Compared to Version 1...
<img width="927" alt="image" src="https://user-images.githubusercontent.com/38586415/105251411-57f56a00-5b73-11eb-9cd9-cfa911de121f.png">

Images in Version 1 Attributed to:

Settings button icon made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

Setting slider icon made by <a href="https://www.flaticon.com/authors/dmitri13" title="dmitri13">dmitri13</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

Add file icon made by <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>

Folder icon made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>

File icon made by  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>

## Technologies
- [JavaScript](#javascript)
- [TypeScript](#typescript)
- [Node](#node)
- [Electron](#electron)
- [HTML](#html)
- [CSS](#css)
- [SASS](#sass)

    ### Explanation of Each Technology's Role

    #### JavaScript
    It's the main language used on the client side for crreating dynamic and interactive content.

    #### TypeScript
    The javascript is actually written in typescript and compiled to javascript by Node.js.
    
    #### HTML
    The mark up langauge of the web.

    #### CSS
    The styling language of the web.

    #### SASS
    The CSS of the project is compiled from SASS, which adds addtional language features like variables for example.

## Requirements to run the project
You will need to have Node installed on your computer.


## Setup
Make sure to install dependecies before running the project.
```
npm install
```
## Running the Project
Clone or download the repository then `cd` to that folder in the commandline / terminal. From that root directory, then enter `npm install` (for node_modules to install) then `npm start`. This will generate JavaScript files from the TypeScirpt files that are in the repository (and likewise SASS into CSS) and then it will load up the project on screen.


## Project Shortcomings
I would like to take some time and some point to add a dark mode and some user settings to the project. These projects when working alone without a team do tend to drag on, but I would like to revisit it to add this improvement.


## Modifications
Findind a way to improve journal file load times would be something I would also like to change with this project.

## Things learned
I learned how to use Node and Electron for the first time. I learnt about TypeScript and SASS for the first time too. Also I believe it was this project that was the first time I used  VScode  and i haven't looked back since... :).

Apart from that I've also done some testing in this project with Mocha. I really wanted to try to make an effort to do some testing with this project as it is something that I struggle with knowing how to do. I was pleased that I was able to start out this project with some testing in a BDD style rather than just adding it in at the end.


[Trello Page](https://trello.com/b/CXi4WL52)


