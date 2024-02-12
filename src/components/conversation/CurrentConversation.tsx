import React, { useEffect, useState } from "react";
import "./Conversation.scss";
import moment from "moment";
import {
  addSubscription,
  removeSubscription,
  createChannel,
} from "../../utils/notificationsController";
import {
  authenticate,
  getCurrentUserConversationsCalls,
} from "../../utils/genesysCloudUtils";
import { GenesysDevIcons, GenesysDevIcon } from "genesys-dev-icons/lib/index";

/**
 * High-level component for the Active Conversations Dashboard.
 *
 * @param props
 * @returns
 */
export function CurrentConversation(props: any) {
  let retryAfter: number = 0;
  const badWords: string[] = ["um", "uh", "mm"];

  const [interactions, setInteractions] = useState([]);
  const [speaker, setSpeaker] = useState("");

  // trigger initialization on component mount
  useEffect(() => {
    setupConvo(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setupConvo() {
    let conversationId: string;
    // authenticate logged-in user
    authenticate()
      .then((data: any) => {
        createChannel();
        return data;
      })
      .then((data: any) => {
        console.log("AUTH", data);
        return getCurrentUserConversationsCalls();
        /*
        id: "f318b74b-1bc5-470f-98af-3155557b9237"
        participants: Array(4)
        0: {id: '97ab531d-b7e4-467e-a029-a01b8ec31be4', name: 'Dianne Gabriel', address: 'tel:+16136992713', startTime: '2024-02-05T20:52:30.331Z', connectedTime: '2024-02-05T20:52:30.484Z', …}
        1: {id: '45feae1e-244c-4c49-86db-9e36a4ba1e4c', name: '[DEV] Shelf_Test_Inbound', address: 'sip:2a4bd143-853a-4c74-a1f1-22bf73639c85@127.0.0.1;language=en-US;user=ivr', startTime: '2024-02-05T20:52:30.346Z', connectedTime: '2024-02-05T20:52:30.362Z', …}
        2: {id: '1b876e8b-231f-4e8e-92f3-dac811f8e719', name: '0 [DEV] Shelf_Test_Queue', address: 'sip:c603dd0c-9006-4720-b261-d1b4a9d15d07@127.0.0.1…b676-cc46ca377c8d/defaultentrypoint.vxml;user=acd', startTime: '2024-02-05T20:52:35.494Z', connectedTime: '2024-02-05T20:52:35.507Z', …}
        3: {id: '2ddc9837-4d12-49e7-a7b1-32e61d6de0a9', address: 'sip:655e83d4bad41b1a8851bc7f+maximuscanada.orgspan…56459e494d6;trunk-context=maximuscanada@localhost', startTime: '2024-02-05T20:52:35.827Z', connectedTime: '2024-02-05T20:52:39.529Z', purpose: 'agent', …}
        length: 4
        recordingState: "active"
        securePause: false
        */
      })
      .then((data: any) => {
        console.log("CONVERSATION JSON", data.entities[0]);
        conversationId = data.entities[0].id;
        subscribeToTranscript(conversationId);
      });
  }

  async function addSubscriptionWrapper(topic: string, cb: any) {
    if (retryAfter > 0) {
      const timeout = retryAfter * 1000;
      setTimeout(() => {
        retryAfter = 0;
        addSubscriptionWrapper(topic, cb);
      }, timeout);
    } else {
      const err = await addSubscription(topic, cb);
      if (err && err.status === 429) {
        retryAfter = err.headers["retry-after"];
        const timeout = retryAfter * 1000;
        setTimeout(() => {
          retryAfter = 0;
          addSubscriptionWrapper(topic, cb);
        }, timeout);
      }
    }
  }

  /**
   * Removes the subscription when a conversation ends.
   *
   * @param topic the subscription topic for removal
   */
  async function cancelSubscription(topic: string) {
    await removeSubscription(topic, () =>
      console.log(`Removed subscription to topic: ${topic}`)
    );
  }

  /**
   * Subscribe to the transcripts of an active conversation
   *
   * @param baseQueues the org's queues
   * @param conversationId the id of the conversation
   * @returns
   */
  async function subscribeToTranscript(conversationId: string) {
    if (!conversationId) return;

    const transcriptionTopic = `v2.conversations.${conversationId}.transcription`;

    // the callback triggered when a transcription notification is received
    const transcriptionCallback = (data: any) => {
      console.log("CONVERSATION NOTIFICATION", data);

      // unpack relevant data from response
      const { eventBody } = data;
      const transcriptArr: any = [];
      transcriptArr.push(
        (eventBody.transcripts || []).map((transcript: any) => {
          return transcript.alternatives?.[0].transcript;
        })
      );

      console.log("TRANSCRIPT ARRAY", transcriptArr);

      // add the new interactions
      const newInteractions = (eventBody.transcripts || []).map(
        (transcript: any) => {
          const origin = transcript.channel.toLowerCase();
          const speaker = origin === "internal" ? "Agent" : "Customer";
          return {
            speaker: setSpeaker(speaker),
            transcript: setInteractions(transcriptArr),
          };
        }
      );

      console.log(transcriptArr);

      const newConversations = () => {
        return {
          status: eventBody.status?.status,
          interactions: [...newInteractions],
        };
      };

      newConversations();
    };

    addSubscriptionWrapper(transcriptionTopic, transcriptionCallback);
  }

  return (
    <div className="conversation">
      <div className="transcript-wrapper">
        <h5>Transcript</h5>
        <div className="transcript-container">
          <p>
            {speaker}: {interactions.map((i: any) => i.join(" "))}
          </p>
        </div>
      </div>
    </div>
  );
}
