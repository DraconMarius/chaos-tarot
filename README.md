# Chaos-Tarot

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

### Description
\
Always interested in Tarot, but never able to brute force memorize what they all mean? Whanting some general advice that the card means for you? Since Tarot is all about symbolism as well, what about some AI generated Cards to compliment the reading?!
\
\
Chaos-Tarot / ChatGPT Tarot is here for your entertainment. Started from an ios shortcut that I had built by chucking tarot data in a dictionary and ask it to choose one so I can save it someplace using note taking app (I was using Bear, an ios markdown app). 
\
\
This MERN Application utilizes the OpenAI API endpoints along with MaterialUI, Apollo graphQL Server, and MongoDB to create an AI generated reading and image and store it in a database. 

[Click here for a link to the deployed app!](https://chaos-tarot.herokuapp.com)

[<img src="./public/assets/188-microphone-recording-lineal.gif" alt='lord-icon' height='90' width='90'>]()


### Usage

To run a developmental server of this application, please clone this repo to your local Machine.

First, download the dependencies by running 


```npm install```


which will install all the packages and dependencies for both the Server and Client folder. 

Next to initiate a fresh instance of our MongoDB database, run


```npm run seed``` 


Finally, run 


```npm run develop``` 


to initiate our development back and front end!

[<img src="./public/assets/1062-disco-ball-flat.gif" alt='lord-icon' height='150' width='150' >]()


We also have a dummy account set up if you'd like to use that to login & checkout our features: 
\
username: dummyAccount
\
email: dummyAccount@gmail.com
\
password: dummyAccount1!


### Features

#### Reading Generation

Logged in user can generate a reading with a press of a button, as well as a drop down menu to customize what kind of reading you would like

#### Create new art
Once the button is pressed, a loading screen pops up. Keep in mind that it might take a little bit before the prompt and image would pop up

![Gif of create page](/public/assets/gif%20of%20create%20page.gif)
\
Once the whole process is finished, a card image and a reading log will display right on the page.


#### Known bugs:
- [ ] OpenAI API returning non-valid JSON
- [x] loading screen won't stop until reload if error



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
![Insomnia](https://camo.githubusercontent.com/ea872adb9aba9cf6b4e976262f6d4b83b97972d0d5a7abccfde68eb2ae55325f/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d4f70656e414926636f6c6f723d343132393931266c6f676f3d4f70656e4149266c6f676f436f6c6f723d464646464646266c6162656c3d)


### Code Snippets 


### Author
**Mari Ma**

[<img src="https://cdn.icon-icons.com/icons2/2351/PNG/512/logo_github_icon_143196.png" alt='github' height='40px'>](https://github.com/DraconMarius)
[<img src="https://cdn.icon-icons.com/icons2/2351/PNG/512/logo_linkedin_icon_143191.png" alt='linkedin' height='40px'>](https://www.linkedin.com/in/mari-ma-70771585/)

[Icon credit @ Anton Kalashnyk](https://icon-icons.com/users/14quJ7FM9cYdQZHidnZoM/icon-sets/)


### Contributing Guidlines

If you would like to contribute to this app, please get in touch and would love to discuss further.


### Questions

For any questions, please reach out directly or by creating an issue.
