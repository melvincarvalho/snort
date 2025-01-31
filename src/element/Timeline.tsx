import { useMemo } from "react";
import useTimelineFeed from "../feed/TimelineFeed";
import { HexKey, TaggedRawEvent, u256 } from "../nostr";
import EventKind from "../nostr/EventKind";
import Note from "./Note";
import NoteReaction from "./NoteReaction";

export interface TimelineProps {
    global: boolean,
    pubkeys: HexKey[]
}

/**
 * A list of notes by pubkeys
 */
export default function Timeline({ global, pubkeys }: TimelineProps) {
    const { main, others } = useTimelineFeed(pubkeys, global);

    const mainFeed = useMemo(() => {
        return main?.sort((a, b) => b.created_at - a.created_at);
    }, [main]);

    function eventElement(e: TaggedRawEvent) {
        switch (e.kind) {
            case EventKind.TextNote: {
                return <Note key={e.id} data={e} related={others} />
            }
            case EventKind.Reaction:
            case EventKind.Repost: {
                return <NoteReaction data={e} key={e.id} />
            }
        }
    }

    return <>{mainFeed.map(eventElement)}</>;
}