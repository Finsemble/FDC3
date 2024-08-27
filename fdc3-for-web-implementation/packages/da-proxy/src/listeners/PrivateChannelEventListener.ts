import { Messaging } from "../Messaging"
import { AbstractListener } from "./AbstractListener"
import { BroadcastEvent } from "@kite9/fdc3-common"

type EVENT_TYPES_WITH_TYPE_HANDLER = "onAddContextListener" | "onUnsubscribe"
export type EVENT_TYPES = EVENT_TYPES_WITH_TYPE_HANDLER | "onDisconnect"

const EVENT_NAMES: { [k: string]: string } = {
    onAddContextListener: "privateChannelOnAddContextListenerEvent",
    onDisconnect: "privateChannelOnDisconnectEvent",
    onUnsubscribe: "privateChannelOnUnsubscribeEvent"
}

abstract class AbstractPrivateChannelEventListener<X> extends AbstractListener<X> {

    readonly privateChannelId: string
    readonly listenerType: string

    constructor(
        messaging: Messaging,
        privateChannelId: string,
        listenerType: string,
        handler: X) {
        super(messaging, { privateChannelId, listenerType }, handler, "privateChannelAddEventListener", "privateChannelUnsubscribeEventListener")
        this.privateChannelId = privateChannelId;
        this.listenerType = listenerType
    }

    filter(m: BroadcastEvent) {
        return (m.type == EVENT_NAMES[this.listenerType]) && (this.privateChannelId == (m.payload as any)?.privateChannelId); /* ISSUE: 1293 */
    }

    abstract action(m: any): void
}

export class PrivateChannelEventListenerVoid extends AbstractPrivateChannelEventListener<() => void> {

    constructor(
        messaging: Messaging,
        channelId: string,
        handler: () => void) {
        super(messaging, channelId, "onDisconnect", handler)
    }

    action(_m: any): void {
        this.handler()
    }

}

export class PrivateChannelEventListenerType extends AbstractPrivateChannelEventListener<(m: string) => void> {

    constructor(
        messaging: Messaging,
        channelId: string,
        listenerType: EVENT_TYPES_WITH_TYPE_HANDLER,
        handler: (s: string) => void) {
        super(messaging, channelId, listenerType, handler)
    }

    action(m: any): void {
        this.handler(m.payload.contextType)
    }

}