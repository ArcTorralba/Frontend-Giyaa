'use client';

import PreJoin from '@/components/PreJoin';
import { cn } from '@/lib/utils';
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  LocalUserChoices,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import { useState } from 'react';

export default function CounselingCall({ token }: { token: string }) {
  const [avPreset, setAVPreset] = useState<{
    audioEnabled: boolean;
    videoEnabled: boolean;
  }>({ audioEnabled: true, videoEnabled: true });
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const handleConnect = (value: LocalUserChoices) => {
    setAVPreset({ ...value });
    setIsConnected((prev) => !prev);
  };

  return (
    <div data-lk-theme="default">
      {!isConnected && <PreJoin onSubmit={handleConnect} />}
      <LiveKitRoom
        className={cn('h-screen', { hidden: !isConnected })}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={isConnected}
        onConnected={() => setIsConnected(true)}
        onDisconnected={handleDisconnect}
        video={avPreset.videoEnabled}
        audio={avPreset.audioEnabled}
      >
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        {/* Your custom component with basic video conferencing functionality. */}
        {isConnected && <Stage />}
        {/* Controls for the user to start/stop audio, video, and screen 
            share tracks and to leave the room. */}
        <ControlBar />
      </LiveKitRoom>
    </div>
  );
}

function Stage() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
