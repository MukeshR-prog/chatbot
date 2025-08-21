import { gql } from '@apollo/client'

export const GET_CHATS = gql`
  query GetChats($userId: uuid!) {
    chats(
      where: { user_id: { _eq: $userId } }
      order_by: { updated_at: desc }
    ) {
      id
      title
      created_at
      updated_at
      user_id
    }
  }
`

export const GET_MESSAGES = gql`
  query GetMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      sender
      created_at
    }
  }
`

export const GET_MESSAGES_SUBSCRIPTION = gql`
  subscription GetMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      sender
      created_at
    }
  }
`

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!, $userId: uuid!) {
    insert_chats_one(object: { title: $title, user_id: $userId }) {
      id
      title
      created_at
      user_id
    }
  }
`

export const INSERT_MESSAGE = gql`
  mutation InsertMessage($chatId: uuid!, $content: String!, $sender: String!) {
    insert_messages_one(object: { 
  chat_id: $chatId, 
      content: $content, 
      sender: $sender
    }) {
      id
      content
      sender
      created_at
    }
  }
`

export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($chat_id: uuid!, $message: String!) {
    sendMessage(chat_id: $chat_id, message: $message) {
      success
      response
      error
    }
  }
`

export const UPDATE_CHAT_TITLE = gql`
  mutation UpdateChatTitle($id: uuid!, $title: String!) {
    update_chats_by_pk(pk_columns: { id: $id }, _set: { title: $title, updated_at: "now()" }) {
      id
      title
      updated_at
    }
  }
`

export const DELETE_CHAT = gql`
  mutation DeleteChat($id: uuid!) {
    delete_messages(where: { chat_id: { _eq: $id } }) {
      affected_rows
    }
    delete_chats_by_pk(id: $id) {
      id
    }
  }
`