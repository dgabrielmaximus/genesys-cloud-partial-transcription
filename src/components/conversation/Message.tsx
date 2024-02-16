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
     <p>{speaker}: {transcript}</p>
    </div>
  );
}
