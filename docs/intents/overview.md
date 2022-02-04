---
id: overview
sidebar_label: Intents Overview
title: Intents Overview
hide_title: true
---

# Intents Overview

Extending APIs from one application to another is powerful. However, it requires bi-lateral agreements where implementors build to proprietary APIs. A standard language for interaction between applications allows us to create workflows on the fly, so that applications can discover and link to another without any prior knowledge.


FDC3 Intents define a standard set of verbs that can be used to put together common cross-application workflows on the financial desktop.
* Applications register the intents & [context data](context/overview) combinations they support in the [App Directory](app-directory/overview).
* The App Directory supports application discovery by intents and/or context data.
* Intents are not full RPC, apps don’t need to enumerate every function with an intent.
* FDC3 standard intents are a limited set, organizations can create their own intents.

## Using Intents
Combined with [context data](context/overview) and [App Directory](app-directory/overview) standards, intents enable rich service discovery on the desktop. For example:

### Ask for a chart to be displayed
```javascript
const result = await fdc3.raiseIntent("ViewChart", {
 type: "fdc3.instrument",
 name: "IBM",
 id: {
    ticker:"ibm"
  }
});
```

### Ask a specific application to display a chart
```javascript
const result = await fdc3.raiseIntent("ViewChart", {
 type: "fdc3.instrument",
 name: "IBM",
 id: {
    ticker:"ibm"
  }
}, "market-data-app");
```

### Find applications that can start a chat
```javascript
const intentApps = await fdc3.findIntent("StartChat");
```

### Find available intents for a contact
```javascript
const intentsAndApps = await fdc3.findIntentsByContext({
 type: "fdc3.contact",
 name: "Jane Doe",
 id: {
    email:"jane@doe.com"
  }
});
```

## Using Intents without a context
As the [Desktop Agent API](api/ref/DesktopAgent) and [App Directory](app-directory/overview) both
require a context to specified whereever intents are used, using an intent without a context is
achieved through the use of an explcit `null` context type `fdc3.nothing`. By using an explicit type
to represent a lack of context we allow applications to declare their support for a lack of 
context.

```javascript
const intentsAndApps = await fdc3.findIntentsByContext({
  type: "fdc3.nothing",
});

const result = await fdc3.raiseIntent("StartChat", {
  type: "fdc3.nothing"
});
```

