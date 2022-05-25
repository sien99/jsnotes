import reducers from "./reducers";
import { composeWithDevTools } from "@redux-devtools/extension";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistMiddleware } from "./middleware/persist-middleware";

export const store = createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(persistMiddleware, thunk))
);
