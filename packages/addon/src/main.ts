import { ResolverIntents } from "@kite9/fdc3-common";
import "./style.css";

// Channel data
const recommendedChannels = [
  {
    id: 'fdc3.channel.1',
    type: 'user',
    displayMetadata: {
      name: 'Channel 1',
      color: 'red',
      glyph: '1',
    },
  },
  {
    id: 'fdc3.channel.2',
    type: 'user',
    displayMetadata: {
      name: 'Channel 2',
      color: 'orange',
      glyph: '2',
    },
  },
  {
    id: 'fdc3.channel.3',
    type: 'user',
    displayMetadata: {
      name: 'Channel 3',
      color: 'yellow',
      glyph: '3',
    },
  },
  {
    id: 'fdc3.channel.4',
    type: 'user',
    displayMetadata: {
      name: 'Channel 4',
      color: 'green',
      glyph: '4',
    },
  },
  {
    id: 'fdc3.channel.5',
    type: 'user',
    displayMetadata: {
      name: 'Channel 5',
      color: 'cyan',
      glyph: '5',
    },
  },
  {
    id: 'fdc3.channel.6',
    type: 'user',
    displayMetadata: {
      name: 'Channel 6',
      color: 'blue',
      glyph: '6',
    },
  },
  {
    id: 'fdc3.channel.7',
    type: 'user',
    displayMetadata: {
      name: 'Channel 7',
      color: 'magenta',
      glyph: '7',
    },
  },
  {
    id: 'fdc3.channel.8',
    type: 'user',
    displayMetadata: {
      name: 'Channel 8',
      color: 'purple',
      glyph: '8',
    },
  },
];

// Example resolver data
const exampleResolverData: ResolverIntents = {
  type: "ResolverIntents",
  appIntents: [
    {
      apps: [{
        appId: "chartiq",
        description: "Chart IQ is the most powerful charting library on the market",
        icons: [{
          src: "https://res.cloudinary.com/apideck/image/upload/v1561415965/catalog/chartiq/icon128x128.jpg"
        }],
        title: "ChartIQ"
      }],
      intent: {
        name: "ViewChart",
        displayName: "View Chart"
      }
    },
    {
      apps: [{
        appId: "trading-view-chart",
        description: "TradingView is a social network for traders and investors on Stock, Futures and Forex markets!",
        icons: [{
          src: "https://apps.connectifi-interop.com/tradingviewChart/icon.png"
        }],
        title: "TradingView Chart"
      }, {
        appId: "adaptabledemo",
        instanceId: "324587329238y7r59824",
        description: "AdapTable is a powerful data grid with a range of advanced features",
        icons: [{
          src: "https://apps.connectifi-interop.com/adaptableDemo/icon.png"
        }],
        title: "AdapTable"
      }],
      intent: {
        name: "ViewInstrument",
        displayName: "View Instrument"
      },
    }],
  source: {
    appId: "fdc3-demo",
    instanceId: "fdc3-demo-instance"
  }
};

let selected = recommendedChannels[2].id;
let expanded = true;

const openChannelIframe = (e: MouseEvent) => {
  const channel = new MessageChannel();

  // STEP 2B: Receive confirmation over port from iframe
  channel.port1.onmessage = ({ data }) => {
    switch (data.type) {

      // User clicked on one of the channels in the channel selector
      // @ts-ignore: Explicit fall-through to iframeHandshake
      case "iframeChannelSelected": {
        // STEP 4B: Receive user selection information from iframe
        selected = data.channel;
      }

      // Handshake completed. Send channel data to iframe
      case "iframeHandshake": {
        // STEP 3A: Send channel data to iframe
        channel.port1.postMessage({
          type: "iframeChannels",
          channels: recommendedChannels,
          selected
        });
        break;
      }

    }

  };

  const {target} = e;
  if(target) (target as HTMLButtonElement).disabled = true;

  const iframe = document.querySelector<HTMLIFrameElement>("#channel-iframe")!;
  iframe.parentElement?.setAttribute("data-visible", "true");

  const resizeButton = document.getElementById("dimensions-btn-channel")!;
  resizeButton.setAttribute("data-visible", "true");
  resizeButton.addEventListener("click", () => {
    expanded = !expanded;
    channel.port1.postMessage({ type: "iframeChannelResize", expanded })
    iframe.setAttribute("data-expanded", `${expanded}`);
    resizeButton.textContent = expanded ? "Collapse" : "Expand";
  });

  // STEP 1A: Send port to iframe
  iframe.contentWindow?.postMessage({ type: 'iframeHello' }, '*', [channel.port2]);
};

const openResolverIframe = (e: MouseEvent )=> {
  const channel = new MessageChannel();

  // STEP 2B: Receive confirmation over port from iframe
  channel.port1.onmessage = ({ data }) => {
    switch (data.type) {
      case "iframeHandshake": {
        // STEP 3A: Send channel data to iframe
        channel.port1.postMessage(exampleResolverData);
        break;
      }
      case "iframeResolveAction":
      case "iframeResolve": {
        // STEP 4B: Receive user selection information from iframe

        // TODO - prettyPrintJson dependency is not referenced, re-enable when added
        // document.getElementById('resolver-user-selection')!.innerHTML = prettyPrintJson.toHtml(data);
        break;
      }
    }

  };
  const {target} = e;
  if(target) (target as HTMLButtonElement).disabled = true;

  const iframe = document.querySelector<HTMLIFrameElement>("#resolver-iframe");
  iframe!.parentElement?.setAttribute("data-visible", "true");

  // STEP 1A: Send port to iframe
  iframe!.contentWindow?.postMessage({ type: 'iframeHello' }, '*', [channel.port2]);
};

window.addEventListener('load', () => {
  document.getElementById('send-btn-channel')!.addEventListener('click', openChannelIframe);
  document.getElementById('send-btn-resolver')!.addEventListener('click', openResolverIframe);
});
