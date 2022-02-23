import ReactDOM from "react-dom";

// setup for react redux:
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
// default import for 'reducer' (without {})
import reducer from "./redux/reducer";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";

// setup for part 10:
import { init } from "./socket.js";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);
import App from "./App.js";
import Welcome from "./Welcome";

// first thing: make fetch request to user:
// to check if the user is logged in or not.

fetch("/user/id.json")
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log(data.userId);

        // user is logged in
        if (data.userId) {
            init(store);
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,
                document.querySelector("main")
            );
        } else {
            // render different components based on userId
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        }
    });
