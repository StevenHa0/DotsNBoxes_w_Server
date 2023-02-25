import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, HashRouter } from "react-router-dom";
import "./App.css";
import App from "./App";
import Game from "./Game";
import { io } from "socket.io-client";

const root = ReactDOM.createRoot(document.getElementById("root"));

const socket = io.connect("http://localhost:8080");

root.render(
  <HashRouter>
    <Routes>
      <Route exact path="/" element={<App socket={socket} />} />
      <Route path="/game" element={<Game socket={socket} />} />
    </Routes>
  </HashRouter>
);
