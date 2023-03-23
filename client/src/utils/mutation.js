import { gql } from '@apollo/client';

// Mutation for signing up a new user
export const SIGNUP = gql`
  mutation SignUp($email: String!, $password: String!, $uprightOnly: Boolean!) {
    signUp(email: $email, password: $password, uprightOnly: $uprightOnly) {
      token
      user {
        _id
        email
        password
        Logs
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
        Logs
      }
    }
  }
`;

// Mutation for updating a user's settings
export const UPDATE_USER = gql`
  mutation UpdateUser($userId: ID!, $uprightOnly: Boolean!) {
    updateUser(userId: $userId, uprightOnly: $uprightOnly) {
      _id
      username
      email
      password
      Logs
    }
  }
`;

// Mutation for creating a new log
export const CREATE_LOG = gql`
  mutation CreateLog($question: String!) {
    createLog(question: $question) {
      _id
      date
      question
      image
      cards {
        _id
      }
      note
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
      image
      cards {
        _id
      }
      note
    }
  }
`;