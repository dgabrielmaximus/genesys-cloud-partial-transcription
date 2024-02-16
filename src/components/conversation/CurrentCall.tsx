import React, { useEffect, useState } from "react";
import "./Conversation.scss";
import {
  addSubscription,
  removeSubscription,
  createChannel,
} from "../../utils/notificationsController";
import {
  authenticate,
  getCurrentUserConversationsCalls,
} from "../../utils/genesysCloudUtils";
import { Message } from "./Message";

export function CurrentCall(props: any) {
  const sampleConvo = [
    { speaker: "Agent", transcript: "Hello, how can I help you today?" },
    { speaker: "Customer", transcript: "I'm having trouble with my account." },
    { speaker: "Agent", transcript: "I can help with that." },
  ];

  return (
    <div className="conversation">
      <div className="transcript-wrapper">
        <h5>Transcript</h5>
        <div className="transcript-container">
          <h1 className="text-3xl font-bold underline">Hello world!</h1>
          {sampleConvo.map((convo, index) => (
            <Message
              key={index}
              speaker={convo.speaker}
              transcript={convo.transcript}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
