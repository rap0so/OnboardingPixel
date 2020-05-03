import { User } from '../io/adapters';

const RECEIVE_USER = payload => User.ResponseData(payload);
const IDENTIFY_USER = (payload, dispatch) =>
  User.RequestData(payload, dispatch);

const CREATE_OR_UPDATE_USER = (payload, dispatch) =>
  User.CreateOrUpdateUser(payload, dispatch);

const DELETE_USER = (payload, dispatch) => User.DeleteData(payload, dispatch);

export default {
  DELETE_USER,
  RECEIVE_USER,
  IDENTIFY_USER,
  CREATE_OR_UPDATE_USER
};
