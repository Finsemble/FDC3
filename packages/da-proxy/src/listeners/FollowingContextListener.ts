import { Channel, Listener } from '@finos/fdc3';
import { RegisterableListener } from './RegisterableListener';

/**
 * This is a spercial version of a ContextListener created when the user calls the 
 * fdc3.addContextListener method.   In this scenario, the listener will respond to broadcasts
 * on whatever is the current user channel.
 */
export interface FollowingContextListener extends Listener, RegisterableListener {

    /** 
     * This method is called when the user channel changes.  The listener should then 
     * call it's handler with the latest piece of relevant channel state and start responding to
     * events on the new channelId.
     */
    changeChannel(ch: Channel | null): Promise<void>

}
