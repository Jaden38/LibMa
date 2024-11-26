const React = require("react");
const ReactDOM = require("react-dom");
const { Button } = require("./components/ui/button");

ReactDOM.render(
    React.createElement(Button, null, "Click Me"),
    document.getElementById("app")
);
