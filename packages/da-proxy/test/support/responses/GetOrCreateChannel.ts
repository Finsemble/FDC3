import { AutomaticResponse, TestMessaging } from "../TestMessaging";
import { ChannelError } from "@finos/fdc3";
import { GetOrCreateChannelRequest, GetOrCreateChannelResponse } from "@kite9/fdc3-common"
import { createResponseMeta } from "./support";

type ChannelType = { [channelId: string]: 'user' | 'app' | 'private' }

export class GetOrCreateChannel implements AutomaticResponse {

    private type: ChannelType = {}


    filter(t: string) {
        return t == 'getOrCreateChannelRequest'
    }

    action(input: object, m: TestMessaging) {
        const out = this.registerChannel(input as GetOrCreateChannelRequest)

        setTimeout(() => { m.receive(out as any) }, 100)
        return Promise.resolve()
    }

    registerChannel(r: GetOrCreateChannelRequest): GetOrCreateChannelResponse {
        const id = r.payload.channelId
        const type = 'app'

        const existingType = this.type[id]

        if ((existingType) && (existingType != type)) {
            // channel already exists
            return {
                type: "getOrCreateChannelResponse",
                meta: createResponseMeta(r.meta),
                payload: {
                    error: ChannelError.AccessDenied
                }
            }

        } else {
            this.type[id] = type
            return {
                type: "getOrCreateChannelResponse",
                meta: createResponseMeta(r.meta),
                payload: {
                    channel: {
                        id,
                        type,
                        displayMetadata: {
                            name: "The " + id + " Channel",
                            color: "cerulean blue",
                            glyph: "triangle"
                        }
                    }
                }
            }
        }
    }
}