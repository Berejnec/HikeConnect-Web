import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";

export default class UserStore {
  user: User | null = null;
  navigate: ((path: string) => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setNavigate(navigate: (path: string) => void) {
    this.navigate = navigate;
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: UserFormValues) => {
    // try {
    const user = await agent.Account.login(creds);
    store.commonStore.setToken(user.token);
    runInAction(() => (this.user = user));
    if (this.navigate) this.navigate("/events");
    store.modalStore.closeModal();
    // } catch (error) {
    //   throw error;
    // }
  };

  logout = () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem("jwt");
    this.user = null;
    if (this.navigate) this.navigate("/");
  };

  getUser = async () => {
    try {
      const user = await agent.Account.current();
      runInAction(() => (this.user = user));
    } catch (error) {
      console.log(error);
    }
  };

  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      if (this.navigate) this.navigate("/events");
      store.modalStore.closeModal();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  setImage = (image: string) => {
    if (this.user) this.user.image = image;
  };

  setDisplayName = (displayName: string) => {
    if (this.user) this.user.displayName = displayName;
  };
}
