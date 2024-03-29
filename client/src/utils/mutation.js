import { gql } from '@apollo/client';

// Mutation for signing up a new user
export const SIGNUP = gql`
  mutation SignUp($email: String!, $password: String!, $uprightOnly: Boolean!) {
    signUp(email: $email, password: $password, uprightOnly: $uprightOnly) {
      token
      user {
        _id
        email
      }
    }
  }
`;

// Mutation for logging in a user
export const LOGIN = gql`
  mutation LogIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password) {
      token
      user {
        _id
        email
        password
        logs{
          _id
          date
          question
          cards {
            _id
            image
            description
            upright
          }
          note
        }
      }
    }
  }
`;

// Mutation for updating a user's settings
export const UPDATE_USER = gql`
  mutation UpdateUser($userId: ID!, $uprightOnly: Boolean!) {
    updateUser(userId: $userId, uprightOnly: $uprightOnly) {
      _id
      uprightOnly
    }
  }
`;

// Mutation for creating a new log
export const CREATE_LOG = gql`
  mutation CreateLog($question: String, $readtype: String!, $pref: Boolean!, $num: String!, $userId: String!) {
    createLog(question: $question, readtype:$readtype , pref: $pref, num: $num, userId: $userId) {
      _id
      date
      question
      readtype
      cards {
        _id
      }
      note
    }
  }
`;

//Mutation for creating a new card img and update log, return log
export const CREATE_CARD = gql`
  mutation CreateCard( $logId: ID!, $imgUrl: String!, $name: String!) {
    createCard( logId: $logId, imgUrl: $imgUrl, name: $name) {
      _id
      date
      question
      readtype
      note
      cards {
        _id
        image
        description
      }
    }
  } 
`;

// Mutation for updating an existing log
export const UPDATE_LOG = gql`
  mutation UpdateLog($logId: ID!, $question: String!, $note: String) {
    updateLog(logId: $logId, question: $question, note: $note) {
      _id
      date
      question
      readtype
      image
      cards {
        _id
        image
        description
        upright
      }
      note
    }
  }
`;