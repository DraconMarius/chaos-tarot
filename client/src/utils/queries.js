import { gql } from '@apollo/client';

//graphQL Queries

// Query for getting the current user
export const ME_QUERY = gql`
  query Me{
    me {
        _id
        email
        uprightOnly
        logs {
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
`;

//get by id
export const USER_QUERY = gql`
query User($userId:ID!) {
  user(userId: $userId){
    user{
      _id
      email
      password
      uprightOnly
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
}`

// Query for getting a specific log
export const LOG_QUERY = gql`
  query Log($logId: ID!) {
    log(logId: $logId) {
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
`;

// Query for getting a specific card
export const CARD_QUERY = gql`
  query Card($cardId: ID!) {
    card(cardId: $cardId) {
      _id
      name
      image
      upright
      date
      user
    }
  }
`;

// Query for getting a specific tarot card meaning
export const TAROT_QUERY = gql`
  query Tarot($tarotName: String!) {
    tarot(tarotName: $tarotName) {
      name
      suit
      upright
      inverted
    }
  }
`;