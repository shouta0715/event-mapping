import {
  StreamingAnswerAction,
  StreamingCandidateAction,
  StreamingOfferAction,
  TerminalData,
} from "@event-mapping/schema";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

type Constructor = {
  event: AdminHandler;
  streamingOffer: (data: StreamingOfferAction["data"]) => void;
  streamingCandidate: (data: StreamingCandidateAction["data"]) => void;
};

export class AdminWebRTC {
  private canvas: HTMLCanvasElement;

  private stream: MediaStream;

  private connections: Map<string, RTCPeerConnection> = new Map();

  constructor(private readonly client: Constructor) {
    const _canvas = document.querySelector<HTMLCanvasElement>("canvas");
    if (!_canvas) throw new Error("No canvas found");

    this.canvas = _canvas;

    this.stream = this.canvas.captureStream(60);

    this.init();
  }

  private init() {
    this.client.event.subscribe((sessions) =>
      this.registerStreamings(sessions)
    );
  }

  private sendSignaling(id: string, data: RTCSessionDescriptionInit) {
    const serialized = JSON.stringify(data);

    this.client.streamingOffer({
      id,
      session: serialized,
    });
  }

  private sendCandidate(id: string, candidate: RTCIceCandidate) {
    const serialized = candidate.toJSON();

    this.client.streamingCandidate({
      id,
      candidate: serialized,
    });
  }

  private async registerStreamings(sessions: TerminalData[]) {
    for (const connection of this.connections.values()) {
      connection.close();
    }

    this.connections.clear();

    const promises = sessions.map((session) => this.setupConnection(session));

    await Promise.all(promises);
  }

  private async setupConnection(session: TerminalData) {
    const connection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    connection.onicecandidate = (event) => {
      if (!event.candidate) return;
      this.sendCandidate(session.id, event.candidate);
    };

    this.stream.getTracks().forEach((track) => {
      connection.addTrack(track, this.stream);
    });

    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    if (connection.localDescription) {
      this.sendSignaling(session.id, connection.localDescription);
    }

    this.connections.set(session.id, connection);
  }

  async onAnswer(data: StreamingAnswerAction["data"]) {
    if (data.answer.type !== "answer") return;

    const { id } = data;
    const connection = this.connections.get(id);
    if (!connection) return;

    const session = new RTCSessionDescription(data.answer);

    await connection.setRemoteDescription(session);
  }

  async startStreaming(session: TerminalData, connection: RTCPeerConnection) {
    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    if (!connection.localDescription) return;

    this.sendSignaling(session.id, connection.localDescription);
  }
}
