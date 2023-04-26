# Chaos-Tarot

![logo](https://res.cloudinary.com/dbjhly3lm/image/upload/h_100/v1682488127/tarot/logo-bkg_zhgsgy.png)

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

### Description

#### Always interested in Tarot, but never able to brute force memorize what they all mean? Whanting some general advice that the card means for you? Since Tarot is all about symbolism as well, what about some AI generated Cards to compliment the reading?!


#### Chaos-Tarot / ChatGPT Tarot is here for your entertainment. Started from an ios shortcut that I had built by chucking tarot data in a dictionary and ask it to choose one so I can save it someplace using note taking app (I was using Bear, an ios markdown app). 


#### This MERN Application utilizes the OpenAI API endpoints along with MaterialUI, Apollo graphQL Server, and MongoDB to create an AI generated reading and image and store it in a database. 

[Click here for a link to the deployed app!](https://chaos-tarot.herokuapp.com)
*please note that this is hosted on a heroku eco server, it goes idle often. Appreciate you patience when loading up the demo*

![demo.gif](https://res.cloudinary.com/dbjhly3lm/image/upload/v1682499009/demo.gif)



### Usage


To run a developmental server of this application, please clone this repo to your local Machine.

**make sure you create a `.env` file at the root of the directory with `OPENAI_API_KEY` and `REACT_APP_API_KEY` set up with your OPEN API key!**

First, download the dependencies by running 


`npm install`


which will install all the packages and dependencies for both the Server and Client folder. 


Next to initiate a fresh instance of our MongoDB database, run


`npm run seed`


Finally, run 


`npm run develop`


to initiate our development back and front end!




### Features

##### Reading Generation
Logged in user can generate a reading with a press of a button, as well as a drop down menu to customize what kind of reading you would like. If a user select an option other than `daily` a text box will be available for you to ask a question too.

![loading-demo.gif](https://res.cloudinary.com/dbjhly3lm/image/upload/v1682499005/2-step-loading.gif)

##### Create new art
Once the button is pressed, a loading screen pops up. Keep in mind that since we are making multiple api calls, it might take a little bit! (The loading text will now change slightly depends on progess)

![card-demo.gif](https://res.cloudinary.com/dbjhly3lm/image/upload/v1682499010/card-generate-demo.gif)


Once the whole process is finished, a card image and a reading log will display right on the page.

you can also hover over the card's name to get a description of the prompt that was used to generate the card!


##### Known bugs/todo:
- [ ] Ability to edit/make notes on the resulting reading log
- [ ] Apollo Server 429 if too many request / occasional cors error
- [x] ~~OpenAI API returning non-valid JSON / Parsing Error~~

    > *4/19/23: JSON error should mostly be fixed. please create an issue if error persist*

- [x] ~~API returning upright meaning even though card is inverted~~
- [x] ~~loading screen won't stop until reload if error in generation~~

    > *4/24/23: improved loading screen and error message*
    added ability to chage upright preference under `profile`
    - [ ] still need positive feednack when sucessfully saved

- [x] ~~add ability to ask question for more specific reading~~

    > *4/25/23: added ability to ask question*


### License


Licensed under the MIT license. [License details here](https://opensource.org/licenses/MIT)


### Built With

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Apollo-GraphQL](https://img.shields.io/badge/ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![OpenAI](https://camo.githubusercontent.com/ea872adb9aba9cf6b4e976262f6d4b83b97972d0d5a7abccfde68eb2ae55325f/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d4f70656e414926636f6c6f723d343132393931266c6f676f3d4f70656e4149266c6f676f436f6c6f723d464646464646266c6162656c3d)


### Code Snippets 


### Author
**Mari Ma**

[<img src="https://res.cloudinary.com/dbjhly3lm/image/upload/h_50/v1682488301/logo_github_icon_143196_phgakv.png" alt='github' >](https://github.com/DraconMarius)
[<img src="https://res.cloudinary.com/dbjhly3lm/image/upload/h_50/v1682488301/logo_linkedin_icon_143191_nv9tim.png" alt='linkedin'>](https://www.linkedin.com/in/mari-ma-70771585/)

[Icon credit @ Anton Kalashnyk](https://icon-icons.com/users/14quJ7FM9cYdQZHidnZoM/icon-sets/)


### Contributing Guidlines

If you would like to contribute to this app, please get in touch and would love to discuss further.


### Questions

For any questions, please reach out directly or by creating an issue.
