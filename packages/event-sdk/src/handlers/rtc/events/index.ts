import {
  EventStreamingCandidate,
  EventStreamingOffer,
  StreamingAnswerAction,
} from "@event-mapping/schema";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

type Constructor = {
  id: string;
  streamingAnswer: (data: StreamingAnswerAction["data"]) => void;
  onTrack: (stream: MediaStream) => void;
};

export class EventWebRTC {
  private readonly client: Constructor;

  private peerConnection: RTCPeerConnection;

  constructor(client: Constructor) {
    this.client = client;

    this.peerConnection = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
    });

    this.peerConnection.ontrack = (event) => {
      const stream = event.streams[0];
      if (!stream) return;

      this.client.onTrack(stream);
    };
  }

  async startReceiving({ offer }: EventStreamingOffer["data"]) {
    const parsed = JSON.parse(offer) as RTCSessionDescriptionInit;
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(parsed)
    );

    this.onAnswer();
  }

  async onCandidate(data: EventStreamingCandidate["data"]) {
    const candidate = new RTCIceCandidate(data);
    await this.peerConnection.addIceCandidate(candidate);
  }

  private sendAnswer(answer: RTCSessionDescription) {
    this.client.streamingAnswer({
      id: this.client.id,
      answer: answer.toJSON(),
    });
  }

  private async onAnswer() {
    const answer = await this.peerConnection.createAnswer();

    await this.peerConnection.setLocalDescription(answer);

    if (!this.peerConnection.localDescription) return;

    this.sendAnswer(this.peerConnection.localDescription);
  }
}
