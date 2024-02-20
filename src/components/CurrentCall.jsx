import React, { useEffect } from "react";
import { authenticate } from "../utils/genesysCloudUtils";
import { createChannel } from "../utils/notificationsController";

export function CurrentCall() {

  useEffect(() => { 
    setupChannel()
  }, []);

  const setupChannel = () => {
    // Authenticate the client
    // Create a channel
    // Add subscription to the channel

    authenticate().then((data) => {
      console.log(data);
      return createChannel()
    })

  }

  // setupChannel()

  return <div>Hello!</div>;
}
