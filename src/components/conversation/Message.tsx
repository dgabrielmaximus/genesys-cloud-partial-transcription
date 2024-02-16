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

export function Message({ speaker, transcript }: any) {
  return (
    <div>
      {/* <p>{speaker}: {transcript}</p> */}
      <div className={`chat ${speaker === "Agent" ? `chat-end` : `chat-start`}`}>
        {/* {speaker === "Agent" ? <div>} */}
        <div className="chat-header">
        {speaker}
          {/* <time className="text-xs opacity-50">2 hours ago</time> */}
        </div>
        <div className="chat-bubble">{transcript}</div>
        {/* <div className="chat-footer opacity-50">Seen</div> */}
      </div>
    </div>
  );
}
