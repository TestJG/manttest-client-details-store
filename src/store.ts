import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/observeOn";
import "rxjs/add/operator/subscribeOn";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/timeout";
import * as deepEqual from "deep-equal";
import {
  reassign, reassignif,
  actionCreator, TypedActionDescription, EmptyActionDescription,
  reducerFromActions, Reducer, StateUpdate,
  createStore, Store, StoreMiddleware,
  withEffects, defineStore, ICreateStoreOptions, logUpdates,
  tunnelActions, extendWithActions, extendWith,
} from "rxstore";

/* MODELS */

export interface DetailsState {
  isAvatarButtonOpen: boolean;
  isLoading: boolean;
  item: RequestsDetailedItemModel | null;
}

export interface RequestsDetailedItemModel {
  id: string;
  subject: string;
  subtitle: string;
  description: string;
  contactname: string;
  contact: string;
  // issuetype: RequestsItemReference | null;
  // zone: RequestsItemReference | null;
  status: RequestsItemStatusModel | null;
  futureStatus: RequestsItemStatusModel[];
  // photos: PhotoDescription[];
  // logs: RequestsItemLogs[];
}

export interface RequestsItemStatusModel {
  letter: string;
  name: string;
  color: string;
  forecolor: string;
  systemname: string;
  id: string;
}

export interface ChangeStatusPayload {
  newStatus: RequestsItemStatusModel;
}

/* ACTIONS */

export interface DetailsEvents {
  toggleAvatarButton(): void;
  editRequest(item: RequestsDetailedItemModel): void;
  changeStatus(newStatus: RequestsItemStatusModel): void;
}

const newEvent = actionCreator<DetailsState>("MantTest.Details/");

export const DetailsActions = {
  toggleAvatarButton: newEvent("TOGGLE_AVATAR_BUTTON", s => reassign(s, {isAvatarButtonOpen: !s.isAvatarButtonOpen})),

  loadItem: newEvent.of<RequestsDetailedItemModel>("LOAD_ITEM", (s, p) => {
    if (!p) { return reassign(s, {item: null}); };
    return reassign(s, {item: {
      id: p.id,
      subject: p.subject,
      subtitle: p.subtitle,
      description: p.description,
      contactname: p.contactname,
      contact: p.contact,
      status: p.status,
      futureStatus: p.futureStatus,
    }}); } ),

  editRequest: newEvent.of<RequestsDetailedItemModel>("EDIT_REQUEST"),

  changeStatus: newEvent.of<RequestsItemStatusModel>("CHANGE_STATUS"),
};

/* STORE */

const DetailsReducer = reducerFromActions(DetailsActions);

export type DetailsStore = Store<DetailsState> & DetailsEvents;

export const defaultDetailsState = (): DetailsState => ({
  isAvatarButtonOpen: false,
  isLoading: false,
  item: null,
});

export const createDetailsStore = () =>
    defineStore<DetailsState, DetailsStore>(
      DetailsReducer,
      defaultDetailsState,
      extendWithActions(DetailsActions)
    );
