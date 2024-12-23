
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AdminState } from './admin.state';

export const selectAdminState = createFeatureSelector<AdminState>('admin');

export const selectAdmin = createSelector(selectAdminState, (state) => state.admin);
export const selectAdminLoading = createSelector(selectAdminState, (state) => state.loading);
export const selectAdminError = createSelector(selectAdminState, (state) => state.error);
export const selectAdminAccessToken=createSelector(selectAdminState,(state)=>state.accessToken);
export const selectAdminRole=createSelector(selectAdminState,(state)=>state.role);