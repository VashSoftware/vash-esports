import { createClient } from "@supabase/supabase-js";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { handleMapPoolUpdate } from "./events/mapPoolUpdate";
import { handleMatchesUpdate } from "./events/matchesUpdate";
import { handleMatchMapsUpdate } from "./events/matchMapsUpdate";
import { handleMatchParticipantPlayersUpdate } from "./events/matchParticipantPlayersUpdate";
import { handleMatchParticipantsUpdate } from "./events/matchParticipantsUpdate";
import { handleMatchQueueUpdate } from "./events/matchQueueUpdate";
import { handleNotificationsUpdate } from "./events/notificationsUpdate";
import { handleQuickQueueUpdate } from "./events/quickQueueUpdate";
import { handleScoresUpdate } from "./events/scoresUpdate";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const app = express();

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

io.on("connection", (socket) => {
  console.log("Client connected!");

  socket.on("join-user", (userId: string) => {
    console.log(`User ${userId} joined!`);
    socket.join(`user-${userId}`);
  });

  socket.on("join-match", (matchId: string) => {
    console.log(`Match ${matchId} joined!`);
    socket.join(`match-${matchId}`);
  });

  socket.on("join-pool", (poolId: string) => {
    console.log(`Pool ${poolId} joined!`);
    socket.join(`pool-${poolId}`);
  });

  socket.on("map-pool-update", (data) => {
    handleMapPoolUpdate(data, io);
  });

  socket.on("matches-update", (data) => {
    handleMatchesUpdate(data, io);
  });

  socket.on("match-maps-update", (data) => {
    handleMatchMapsUpdate(data, io);
  });

  socket.on("match-participants-update", (data) => {
    handleMatchParticipantsUpdate(data, io);
  });

  socket.on("match-participant-players-update", (data) => {
    handleMatchParticipantPlayersUpdate(data, io);
  });

  socket.on("notifications-update", (data) => {
    handleNotificationsUpdate(data, io);
  });

  socket.on("scores-update", (data) => {
    handleScoresUpdate(data, io, supabase);
  });

  socket.on("match-queue-update", (data) => {
    handleMatchQueueUpdate(data, io);
  });

  socket.on("quick-queue-update", (data) => {
    handleQuickQueueUpdate(data, io);
  });
});

httpServer.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
