---
id: desktopAgentCommunicationProtocol
sidebar_label: Desktop Agent Communication Protocol 
title: Desktop Agent Communication Protocol  (next)
---

# Desktop Agent Communication Protocol (DACP)

DACP constitutes a set of messages that are used by the `@finos/fdc3` library to communicate with Browser-Resident DAs. Each message takes the form of a Flux Standard Action (FSA). Communications are bidirectional and occur over HTML standard MessagePorts. All messages are query/response. Responses may contain requested data or may simply be acknowledgement of receipt.

:::note

We refer to "the library" to mean the code imported from `@finos/fdc3` and initiated from a call to `getAgent()`.

:::

Type definitions for all DACP messages can be found here: [bcp.ts](TODO).

## Protocol conventions

The protocol is divided into groups of messages:

1) Messages sent from the library to the DA. These typically have a 1:1 correspondence with function calls on `DesktopAgent` and `Channel`, and ancillary functionality such as unsubscribing.

2) Response messages, sent from the DA to the library. Every message sent from the library to the DA will receive a response. In most cases, the type will simply have "Response" appended. For instance, the response message for `getInfo` is `getInfoResponse`. For all other cases the `DACPAck` message will be the response. Every response's payload will contain an error string if an error occurred, otherwise it will contain the expected data.

3) Asynchronous "inbound" messages, sent from the DA to the library. These messages are due to actions in other apps, such as an inbound context resulting from another app's broadcast. These messages have the name of the originating message appended with `Inbound`. For example, if another app called `broadcast` then this app would receive a message called `broadcastInbound`.

Every message has a `meta.messageId`. Initiating messages must set this to be a unique string. Response messages must use the string from their corresponding initiating message. The `messageId` can be used by library and DA to match incoming message responses with their initial requests.

## Multiplexing

For any given contextType or intent, the library should only ever send `DACPAddContextListener` or `DACPAddIntentListener` one time. The DA is only responsible for sending any given Context or Intent _once_ to an app. The DA may ignore duplicate listener registrations.

If the app has registered multiple listeners for these types then it is the responsibility of the _library_ to multiplex the delivered Context, or to choose a specific intent listener.

When the API calls the unsubscriber for a listener then `DACPRemoveContextListener` or `DACPRemoveIntentListener` should be sent to the DA.

## Intents

Refer [Private Channel examples](../ref/PrivateChannel.md#server-side-example) to understand how intent transactions work.

When an app ("client") calls `raiseIntent()` or `raiseIntentByContext()`, the library MUST send the corresponding `DACPRaiseIntent` or `DACPRaiseIntentByContext` message to the DA.

The DA will resolve the intent and then deliver a `DACPIntentInbound` message to the library in the resolved app ("server"). This message will contain a `responseId` that has been generated by the DA.

After the message has been sent, the DA will respond back to the "client" app's library with a `DACPRaiseIntentResponse` message containing that `responseId`.

If the "client" app then calls `getResult()`, then the library will wait until a `DACPIntentResult` message is received with a corresponding `responseId`. It will resolve the `getResult()` call with either a Context or PrivateChannel depending on the contents of the result.

Meanwhile, if the "server" app's intent handler resolves to a Channel or Context then the library should send a `DACPIntentResult` with the `responseId` that was initially received from `DACPIntentInbound`.


## Intent Resolver

The DA should send `DACPResolveIntent` if it requires an external UI for intent resolution. This MUST include the list of available apps which are capable of being launched to handle the intent, and it MUST include the list of open apps which are capable of handling the intent. The "@finos/fdc3" library will present UI to the end user, and then will respond with a `DACPResolveIntentResponse` containing the user's choice.

DAs are free to provide their own intent resolution UIs if they have this capability.

## Channels

The DA should send `DACPInitializeChannelSelector` if it requires the app to provide UI for channel selection. The "@finos/fdc3" library will provide the UI when this message is received.

Any message related to a channel contains a `channelId` field. It is the responsibility of each party (DA and library) to correlate `channelId` fields with the correct local objects.

For instance, when the library receives a `DACPBroadcastInbound` message, it should look for the `channelId` field, and only deliver that message to listeners on the corresponding local `Channel` object.

Likewise, when an app calls `channel.broadcast()` then the library should send the `DACPBroadcast` message with the `channelId` set accordingly.

## Private Channels

In general, private channels behave as channels. The DA MUST assign a unique `channelId` in response to `DACPCreatePrivateChannel` messages. `DACPBroadcast` and `DACPAddContextListener` messages can be transmitted with this `channelId`.

See [Intents](#intents) for the process that is used to established a private channel.

FDC3's `PrivateChannel` object has some specific functions, each of which has a corresponding DACP message. For instance, `PrivateChannel.onAddContextListener()` can be implemented using the `DACPPrivateChannelOnAddContextListener` message. Each of these types of messages contains a `channelId` which can be used to identify the channel.

The DA should send `DACPPrivateChannelOnAddContextListener` and `DACPPrivateChannelOnUnsubscribe` messages whenever `DACPAddContextListener` or `DACPRemoveContextListener` is called on a private channel. These will be delivered to the library regardless of whether a client has actually called `onAddContextListener()` and `onUnsubscribe()`. It is the library's responsibility to track these calls and either deliver or discard the messages accordingly.

Likewise, the DA should send `DACPPrivateChannelOnDisconnect` whenever the `DACPPrivateChannelDisconnect` message is received. It is the library's responsibility to deliver or discard this message.