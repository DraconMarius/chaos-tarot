import { gql } from '@apollo/client';

// Mutation for signing up a new user
const SIGNUP_MUTATION = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!, $uprightOnly: Boolean!) {
    signUp(username: $username, email: $email, password: $password, uprightOnly: $uprightOnly) {
      token
      user {
        _id
        username
        email
        password
        Logs
      }
    }
  }
`;

// Mutation for logging in a user
const LOGIN_MUTATION = gql`
  mutation LogIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        password
        Logs
      }
    }
  }
`;

// Mutation for updating a user's settings
const UPDATE_USER_MUTATION = gql`
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
const CREATE_LOG_MUTATION = gql`
  mutation CreateLog($question: String!, $cards: [cardContent]!, $note: String) {
    createLog(question: $question, cards: $cards, note: $note) {
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
const UPDATE_LOG_MUTATION = gql`
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