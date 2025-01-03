import {  createReducer, on } from '@ngrx/store';
import { initialUserState } from './user.state';
import * as UserActions from './user.action';

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.loginUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loginUserSuccess, (state, { user, accessToken}) => ({
    ...state,
    user,
    accessToken,
    role:'user',
    loading: false,
    error: null,
  })),
  on(UserActions.loginUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UserActions.logoutUser, () => initialUserState),
  on(UserActions.updateUserProfile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.updateUserProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(UserActions.updateUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(UserActions.loadProfessionalDetails, (state) => ({
    ...state,
    loading: true,
  })),
  on(UserActions.loadProfessionalDetailsSuccess, (state, { professionalDetails }) => ({
    ...state,
    loading: false,
    professionalDetails,
  })),
  on(UserActions.loadProfessionalDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UserActions.updateProfessionalDetailsSuccess, (state, { professionalDetails }) => ({
    ...state,
    professionalDetails,
    loading: false,
  })),
  on(UserActions.updateProfessionalDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UserActions.resetUserState, () => initialUserState)
);
