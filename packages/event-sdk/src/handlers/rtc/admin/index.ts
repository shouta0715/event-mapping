import {
  StreamingAnswerAction,
  StreamingCandidateAction,
  StreamingOfferAction,
  TerminalData,
} from "@event-mapping/schema";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

type Constructor = {
  streamingOffer: (data: StreamingOfferAction["data"]) => void;
  streamingCandidate: (data: StreamingCandidateAction["data"]) => void;
  sessions: TerminalData[];
};

export class AdminWebRTC {
  private peerConnection: RTCPeerConnection;

  private canvas: HTMLCanvasElement;

  private stream: MediaStream;

  constructor(private readonly client: Constructor) {
    const _canvas = document.querySelector<HTMLCanvasElement>("canvas");
    if (!_canvas) throw new Error("No canvas found");

    this.canvas = _canvas;

    this.stream = this.canvas.captureStream(30);

    this.peerConnection = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
    });

    this.init();
  }

  private init() {
    this.tracks();
    this.onCandidate();
  }

  private tracks() {
    this.stream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.stream);
    });
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

  private onCandidate() {
    this.peerConnection.onicecandidate = (event) => {
      if (!event.candidate) return;

      for (const session of this.client.sessions) {
        this.sendCandidate(session.id, event.candidate);
      }
    };
  }

  async onAnswer(data: StreamingAnswerAction["data"]) {
    if (data.answer.type !== "answer") return;

    const session = new RTCSessionDescription(data.answer);

    await this.peerConnection.setRemoteDescription(session);
  }

  async startStreaming(sessions: TerminalData[]) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    if (!this.peerConnection.localDescription) return;

    for (const session of sessions) {
      this.sendSignaling(session.id, this.peerConnection.localDescription);
    }
  }
}
