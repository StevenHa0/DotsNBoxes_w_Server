import "./App.css";
import { useState, useEffect } from "react";
import dots from "./dots.png";
import { Link } from "react-router-dom";
import { Button, Center, Modal, TextInput } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const App = (props) => {
  let appSocket = props.socket;
  const [joinGameOpened, setJoinGameOpened] = useState(false);
  const [room, setRoom] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);

  const navigate = useNavigate();

  const useJoinGame = () => {
    if (room !== "" && !invalidCode && !limitReached) {
      // TODO: if its an invalid code dont send this emit
      appSocket.emit("join-room", { room, newGame: false });
    } else {
      console.log("Invalid Code");
    }
  };

  const useNewGame = () => {
    let generatedRoom = Math.floor(10000 + Math.random() * 90000).toString();
    setRoom(generatedRoom);
    appSocket.emit("join-room", { room: generatedRoom, newGame: true });
    appSocket.emit("send-room", { room: generatedRoom });
  };

  useEffect(() => {
    appSocket.on("join-success", (data) => {
      if (data) navigate("/game");
    });
    appSocket.on("limit-reached", (data) => {
      if (data) setLimitReached(true);
    });
    appSocket.on("invalid-code", (data) => {
      if (data) setInvalidCode(true);
    });
    appSocket.on("player-number", (playerNum) => {
      console.log("IN APP: ", playerNum);
    });
    appSocket.on("room-code", (data) => {
      console.log("ROOM CODE:", data);
    });
  }, [appSocket]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={dots} className="App-logo" alt="logo" />
        <p className="title">Dots N Boxes</p>
        <Modal
          className="modal"
          opened={joinGameOpened}
          onClose={() => {
            setJoinGameOpened(false);
            setInvalidCode(false);
            setLimitReached(false);
          }}
          title="Welcome! Enter a code to join a game."
        >
          <TextInput
            placeholder="Code"
            label="Game code"
            value={room}
            error={
              (invalidCode
                ? "Invalid code. Close this window and try again"
                : false) ||
              (limitReached
                ? "Game capacity reached. Close this window and try again"
                : false)
            }
            onChange={(event) => setRoom(event.currentTarget.value)}
          />
          <Center>
            <Button size="md" className="join-game" onClick={useJoinGame}>
              Join Game
            </Button>
          </Center>
        </Modal>
        <Center>
          <Button
            size="lg"
            variant="subtle"
            component={Link}
            to="/game"
            onClick={useNewGame}
          >
            New Game
          </Button>
          <Button
            size="lg"
            variant="subtle"
            onClick={() => setJoinGameOpened(true)}
          >
            Join Game
          </Button>
        </Center>
      </header>
    </div>
  );
};

export default App;
