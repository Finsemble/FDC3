---
id: DesktopAgent
sidebar_label: DesktopAgent
title: DesktopAgent
hide_title: true
---
# `DesktopAgent`

An FDC3 Desktop Agent is a desktop component (or aggregate of components) that serves as an orchestrator for applications in its domain.

A Desktop Agent can be connected to one or more App Directories and will use directories for application identity and discovery. Typically, a Desktop Agent will contain the proprietary logic of a given platform, handling functionality like explicit application interop workflows where security, consistency, and implementation requirements are proprietary.

It is expected that the `DesktopAgent` interface is made availabe via the [`window.fdc3`](Globals#windowfdc3-object) global object, and that the [`fdc3Ready`](Globals#fdc3ready-event) event fires when it is ready to be used.

```ts
interface DesktopAgent {
  // apps
  open(app: TargetApp, context?: Context): Promise<AppMetadata>;
  findInstances(app: TargetApp): Promise<Array<AppMetadata>>;

  // context
  broadcast(context: Context): Promise<void>;
  addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;
  /**
   * @deprecated 'Use `addContextListener(null, handler)` instead of `addContextListener(handler)`
   */
  addContextListener(handler: ContextHandler): Promise<Listener>;

  // intents
  findIntent(intent: string, context?: Context): Promise<AppIntent>;
  findIntentsByContext(context: Context): Promise<Array<AppIntent>>;
  raiseIntent(intent: string, context: Context, app?: TargetApp): Promise<IntentResolution>;
  raiseIntentForContext(context: Context, app?: TargetApp): Promise<IntentResolution>;
  addIntentListener(intent: string, handler: ContextHandler): Promise<Listener>;

  // channels
  getOrCreateChannel(channelId: string): Promise<Channel>;
  getSystemChannels(): Promise<Array<Channel>>;
  // optional channel management functions
  joinChannel(channelId: string) : Promise<void>;
  getCurrentChannel() : Promise<Channel | null>;
  leaveCurrentChannel() : Promise<void>;

  //implementation info
  getInfo(): Promise<ImplementationMetadata>;
}
```

## Methods

### `addContextListener`

```ts
addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;
/**
 * @deprecated 'Use `addContextListener(null, handler)` instead of `addContextListener(handler)`
 */
addContextListener(handler: ContextHandler): Promise<Listener>;
```
Adds a listener for incoming context broadcasts from the Desktop Agent. If the consumer is only interested in a context of a particular type, they can specify that type. If the consumer is able to receive context of any type or will inspect types received, then they can pass `null` as the `contextType` parameter to receive all context types. 

Context broadcasts are only received from apps that are joined to the same channel as the listening application, hence, if the application is not currently joined to a channel no broadcasts will be received. 

If this function is called after the app has joined a channel and the channel already contains context that would be passed to the context listener, then it will be called immediately with that context. If a listener is added first and then the app is joined to a channel, with current context that would be passed to the context listener, then the listener will again be called immediately with that context.

#### Examples
```js
// any context
const listener = await fdc3.addContextListener(null, context => { ... });

// listener for a specific type
const contactListener = await fdc3.addContextListener('fdc3.contact', contact => { ... });
```

#### See also
* [`Listener`](Types#listener)
* [`Context`](Types#context)



### `addIntentListener`

```ts
addIntentListener(intent: string, handler: ContextHandler): Promise<Listener>;
```
 Adds a listener for incoming Intents from the Agent.

#### Examples

```js
const listener = await fdc3.addIntentListener('StartChat', context => {
  // start chat has been requested by another application
});
```

#### See also
* [`Listener`](Types#listener)
* [`Context`](Types#context)



### `broadcast`

```ts
broadcast(context: Context): Promise<void>;
```

Publishes context to other apps on the desktop.  Calling `broadcast` at the `DesktopAgent` scope will push the context to whatever `Channel` the app is joined to.  If the app is not currently joined to a channel, calling `fdc3.broadcast` will have no effect.  Apps can still directly broadcast and listen to context on any channel via the methods on the `Channel` class.

DesktopAgent implementations should ensure that context messages broadcast to a channel by an application joined to it are not delivered back to that same application.

If you are working with complex context types composed of other simpler types (as recommended by the [Context Data specification](../../context/spec#assumptions)) then you should broadcast each individual type (starting with the simpler types, followed by the complex type) that you want other apps to be able to respond to. Doing so allows applications to filter the context types they receive by adding listeners for specific context types.

#### Example
```js
const instrument = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'AAPL'
    }
};

fdc3.broadcast(instrument);
```
#### See also
* [addContextListener](#addcontextlistener)

### `findInstances`

```ts
findInstances(app: TargetApp): Promise<Array<AppMetadata>>;
```

Find all the available instances for a particular application.

If there are no instances of the specified application the returned promise should resolve to an empty array.

If the resolution fails, the promise will return an `Error` with a string from the [`ResolveError`](ResolveError) enumeration.

### Example
```js
// Retrieve a list of instances of an application
let instances = await fdc3.findInstances({name: "MyApp"});

// Target a raised intent at a specific instance
let resolution = fdc3.raiseIntent("ViewInstrument", context, instances[0]);
```


### `findIntent`

```ts
findIntent(intent: string, context?: Context): Promise<AppIntent>;
```

Find out more information about a particular intent by passing its name, and optionally its context.

`findIntent` is effectively granting programmatic access to the Desktop Agent's resolver.
It returns a promise resolving to the intent, its metadata and metadata about the apps and app instances that are registered to handle it.
This can be used to raise the intent against a specific app or app instance.

If the resolution fails, the promise will return an `Error` with a string from the [`ResolveError`](ResolveError) enumeration.

#### Examples
```js
// I know 'StartChat' exists as a concept, and want to know more about it ...
const appIntent = await fdc3.findIntent("StartChat");
// returns a single AppIntent:
// {
//   intent: { name: "StartChat", displayName: "Chat" },
//   apps: [
//    { name: "Skype" }, 
//    { name: "Symphony" }, 
//    { name: "Slack" }
//   ]
// }

// raise the intent against a particular app
await fdc3.raiseIntent(appIntent.intent.name, context, appIntent.apps[0].name);

//later, we want to raise 'StartChat' intent again
const appIntent = await fdc3.findIntent("StartChat");
// returns an AppIntent, but with multiple options for resolution, 
// which includes an existing instance of an application:
// {
//   intent: { name: "StartChat", displayName: "Chat" },
//   apps: [
//    { name: "Skype" }, 
//    { name: "Symphony" }, 
//    { name: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859" }, 
//    { name: "Slack" }
//   ]
```

#### See also
* [`ResolveError`](Errors#resolveerror)

### `findIntentsByContext`

```ts
findIntentsByContext(context: Context): Promise<Array<AppIntent>>;
```

Find all the avalable intents for a particular context.
`findIntentsByContext` is effectively granting programmatic access to the Desktop Agent's resolver.
A promise resolving to all the intents, their metadata and metadata about the apps and app instances that registered as handlers is returned, based on the context types the intents have registered.

If the resolution fails, the promise will return an `Error` with a string from the [`ResolveError`](Errors#resolveerror) enumeration.

 #### Example
 ```js
 // I have a context object, and I want to know what I can do with it, hence, I look for intents...
 const appIntents = await fdc3.findIntentsByContext(context);

 // returns, for example:
 // [
 //   {
 //     intent: { name: "StartCall", displayName: "Call" },
 //     apps: [{ name: "Skype" }]
 //   },
 //   {
 //     intent: { name: "StartChat", displayName: "Chat" }, 
 //     apps: [
 //       { name: "Skype" }, 
 //       { name: "Symphony" }, 
 //       { name: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859" }, 
 //       { name: "Slack" }
 //     ]
 //   }
 // ];

 // select a particular intent to raise
 const startChat = appIntents[1];

 // target a particular app or instance
 const selectedApp = startChat.apps[2];

 // raise the intent, passing the given context, targeting the app
 await fdc3.raiseIntent(startChat.intent.name, context, selectedApp);
 ```

#### See also
   * [`findIntent()`](#findintent)
   * [`ResolveError`](Errors#resolveerror)



### `getCurrentChannel`

```ts
getCurrentChannel() : Promise<Channel | null>;
```

Optional function that returns the `Channel` object for the current channel membership.  In most cases, an application's membership of channels SHOULD be managed via UX provided to the application by the desktop agent, rather than calling this function directly. 

Returns `null` if the app is not joined to a channel.


#### Examples

```js
// get the current channel membership
let current = await fdc3.getCurrentChannel();
```

#### See also
* [`Channel`](Channel)



### `getInfo`

```ts
getInfo(): Promise<ImplementationMetadata>;
```

Retrieves information about the FDC3 Desktop Agent implementation, such as the implemented version of the FDC3 specification and the name of the implementation provider.

Returns an [`ImplementationMetadata`](Metadata#implementationmetadata) object.  This metadata object can be used to vary the behavior of an application based on the version supported by the Desktop Agent and for logging purposes.

#### Example

```js
import {compareVersionNumbers, versionIsAtLeast} from '@finos/fdc3';

if (fdc3.getInfo && versionIsAtLeast(await fdc3.getInfo(), "1.2")) {
  await fdc3.raiseIntentForContext(context);
} else {
  await fdc3.raiseIntent("ViewChart", context);
}
```

#### See also
* [`ImplementationMetadata`](Metadata#implementationmetadata)

### `getOrCreateChannel`

```ts
getOrCreateChannel(channelId: string): Promise<Channel>;
```

Returns a Channel object for the specified channel, creating it (as an _App_ channel) - if it does not exist.
`Error` with a string from the [`ChannelError`](ChannelError) enumeration if channel could not be created or access was denied.

#### Example

```js
try {
  const myChannel = await fdc3.getOrCreateChannel("myChannel");
  const myChannel.addContextListener(null, context => {});
}
catch (err){
  //app could not register the channel
}

```

#### See also
*  [`Channel`](Channel)

### `getSystemChannels`
```ts
getSystemChannels() : Promise<Array<Channel>>;
```
Retrieves a list of the System channels available for the app to join.

#### Example

```js
const systemChannels = await fdc3.getSystemChannels();
const redChannel = systemChannels.find(c => c.id === 'red');
```

#### See also
* [`Channel`](Channel)


### `joinChannel`

```ts
joinChannel(channelId: string) : Promise<void>;
```

Optional function that joins the app to the specified channel. In most cases, applications SHOULD be joined to channels via UX provided to the application by the desktop agent, rather than calling this function directly.

If an app is joined to a channel, all `fdc3.broadcast` calls will go to the channel, and all listeners assigned via `fdc3.addContextListener` will listen on the channel. 

If the channel already contains context that would be passed to context listeners added via `fdc3.addContextListener` then those listeners will be called immediately with that context.

An app can only be joined to one channel at a time.

Rejects with an error if the channel is unavailable or the join request is denied. The error string will be drawn from the [`ChannelError`](Errors#channelerror) enumeration.

#### Examples

```js
// get all system channels
const channels = await fdc3.getSystemChannels();

// create UI to pick from the system channels

// join the channel on selection
fdc3.joinChannel(selectedChannel.id);

```
#### See also
* [`getSystemChannels`](#getSystemChannels)



### `leaveCurrentChannel`

```ts
leaveCurrentChannel() : Promise<void>;
```

Optional function that removes the app from any channel membership.  In most cases, an application's membership of channels SHOULD be managed via UX provided to the application by the desktop agent, rather than calling this function directly.

Context broadcast and listening through the top-level `fdc3.broadcast` and `fdc3.addContextListener` will be a no-op when the app is not joined to a channel.

#### Examples

```js
//desktop-agent scope context listener
const fdc3Listener = fdc3.addContextListener(null, context => {});

await fdc3.leaveCurrentChannel();
//the fdc3Listener will now cease receiving context

//listening on a specific channel though, will continue to work
redChannel.addContextListener(null, channelListener);

```



### `open`

```ts
open(app: TargetApp, context?: Context): Promise<AppMetadata>;
```

Launches an app with target information, which can be either be a string like a name, or an [`AppMetadata`](Metadata#appmetadata) object.

The `open` method differs in use from [`raiseIntent`](#raiseIntent).  Generally, it should be used when the target application is known but there is no specific intent.  For example, if an application is querying the App Directory, `open` would be used to open an app returned in the search results.

**Note**, if the intent, context and target app name are all known, it is recommended to instead use [`raiseIntent`](#raiseIntent) with the `target` argument.

If a [`Context`](Types#context) object is passed in, this object will be provided to the opened application via a contextListener. The Context argument is functionally equivalent to opening the target app with no context and broadcasting the context directly to it.

Returns an [`AppMetadata`](Metadata#appmetadata) object with the `instanceId` field set identifying the instance of the application opened by this call.

If opening errors, it returns an `Error` with a string from the [`OpenError`](Errors#openerror) enumeration.

#### Example
 ```js
// Open an app without context, using the app name
let instanceMetadata = await fdc3.open('myApp');

// Open an app without context, using an AppMetadata object to specify the target
let appMetadata = {name: 'myApp', appId: 'myApp-v1.0.1', version: '1.0.1'};
let instanceMetadata = await fdc3.open(appMetadata);

// Open an app with context 
let instanceMetadata = await fdc3.open(appMetadata, context);
```

#### See also
* [`Context`](Types#context)
* [`TargetApp`](Types#targetapp)
* [`AppMetadata`](Metadata#appmetadata)
* [`OpenError`](Errors#openerror)

### `raiseIntent`

```ts
raiseIntent(intent: string, context: Context, app?: TargetApp): Promise<IntentResolution>;
```
Raises a specific intent for resolution against apps registered with the desktop agent. 

The desktop agent will resolve the correct app to target based on the provided intent name and context data. If multiple matching apps are found, a method for resolving the intent to a target app, such as presenting the user with a resolver UI allowing them to pick an app, SHOULD be provided.
Alternatively, the specific app or app instance to target can also be provided. A list of valid target applications and instances can be retrieved via [`findIntent`](DesktopAgent#findintent).  

If you wish to raise an intent without a context, use the `fdc3.nothing` context type. This type exists so that apps can explicitly declare support for raising an intent without context.

Returns an `IntentResolution` object with details of the app instance that was selected (or started) to respond to the intent.

If a target app for the intent cannot be found with the criteria provided or the user either closes the resolver UI or otherwise cancels resolution, an `Error` with a string from the [`ResolveError`](Errors#resolveerror) enumeration is returned. If a specific target `app` parameter was set, but either the app or app instance is not available then the `ResolveError.TargetAppUnavailable` or `ResolveError.TargetInstanceUnavailable` errors MUST be returned.

#### Example

```js
// raise an intent for resolution by the desktop agent
// a resolver UI may be displayed, or another method of resolving the intent to a 
// target applied, if more than one application can resolve the intent
await fdc3.raiseIntent("StartChat", context);

// or find apps to resolve an intent to start a chat with a given contact
const appIntent = await fdc3.findIntent("StartChat", context);

// use the metadata of an app or app instance to describe the target app for the intent
await fdc3.raiseIntent("StartChat", context, appIntent.apps[0]);

//Raise an intent without a context by using the null context type
await fdc3.raiseIntent("StartChat", {type: "fdc3.nothing"});
```
#### See also
* [`Context`](Types#context)
* [`TargetApp`](Types#targetapp)
* [`IntentResolution`](Metadata#intentresolution)
* [`ResolveError`](Errors#resolveerror)

### `raiseIntentForContext`

```ts
raiseIntentForContext(context: Context, app?: TargetApp): Promise<IntentResolution>;
```

Finds and raises an intent against apps registered with the desktop agent based purely on the type of the context data.

The desktop agent SHOULD first resolve to a specific intent based on the provided context if more than one intent is available for the specified context. This MAY be achieved by displaying a resolver UI. It SHOULD then resolve to a specific app to handle the selected intent and specified context. 
Alternatively, the specific app or app instance to target can also be provided, in which case any method of resolution SHOULD only consider intents supported by the specified application. 

Using `raiseIntentForContext` is similar to calling `findIntentsByContext`, and then raising an intent against one of the returned apps, except in this case the desktop agent has the opportunity to provide the user with a richer selection interface where they can choose both the intent and target app.

Returns an `IntentResolution` object with a handle to the app that responded to the selected intent.

If a target app for the intent cannot be found with the criteria provided or the user either closes the resolver UI or otherwise cancels resolution, an `Error` with a string from the [`ResolveError`](Errors#resolveerror) enumeration is returned. If a specific target `app` parameter was set, but either the app or app instance is not available then the `ResolveError.TargetAppUnavailable` or `ResolveError.TargetInstanceUnavailable` errors MUST be returned. 

#### Example

```js
// Display a resolver UI for the user to select an intent and application to resolve it
const intentResolution = await fdc3.raiseIntentForContext(context);

// Resolve against all intents registered by a specific target app for the specified context
await fdc3.raiseIntentForContext(context, targetAppMetadata);
```

#### See also
* [`Context`](Types#context)
* [`TargetApp`](Types#targetapp)
* [`IntentResolution`](Metadata#intentresolution)
* [`ResolveError`](Errors#resolveerror)
