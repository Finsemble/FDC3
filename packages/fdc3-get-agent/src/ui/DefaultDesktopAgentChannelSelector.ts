import { Channel } from "@kite9/fdc3-standard";
import { ChannelSelector } from "@kite9/fdc3-standard"
import { AbstractUIComponent } from "./AbstractUIComponent";
import { BrowserTypes } from "@kite9/fdc3-schema";

type Fdc3UserInterfaceChannels = BrowserTypes.Fdc3UserInterfaceChannels
type Fdc3UserInterfaceChannelSelected = BrowserTypes.Fdc3UserInterfaceChannelSelected

/**
 * Works with the desktop agent to provide a simple channel selector.
 * 
 * This is the default implementation, but can be overridden by app implementers calling 
 * the getAgent() method
 */
export class DefaultDesktopAgentChannelSelector extends AbstractUIComponent implements ChannelSelector {

    private callback: ((channelId: string | null) => void) | null = null

    constructor(url: string | null) {
        super(url ?? "https://fdc3.finos.org/webui/channel_selector.html", "FDC3 Channel Selector")
    }

    async setupMessagePort(port: MessagePort): Promise<void> {
        await super.setupMessagePort(port)
        this.port = port

        port.addEventListener("message", (e) => {
            if (e.data.type !== 'Fdc3UserInterfaceChannelSelected') {
                return
            }

            const choice: Fdc3UserInterfaceChannelSelected = e.data
            this.callback?.(choice.payload.selected)
        })
    }

    updateChannel(channelId: string | null, availableChannels: Channel[]): void {
        const message: Fdc3UserInterfaceChannels = {
            type: 'Fdc3UserInterfaceChannels',
            payload: {
                selected: channelId,
                userChannels: availableChannels.map(ch => {
                    return {
                        type: "user",
                        id: ch.id,
                        displayMetadata: ch.displayMetadata
                    }
                })
            }
        }
        // also send to the iframe
        this.port?.postMessage(message)
    }

    setChannelChangeCallback(callback: (channelId: string | null) => void): void {
        this.callback = callback
    }

}