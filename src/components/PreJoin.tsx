'use client';
import {
  PreJoinProps,
  usePreviewTracks,
  ParticipantPlaceholder,
  TrackToggle,
  MediaDeviceMenu,
} from '@livekit/components-react';
import {
  Track,
  LocalVideoTrack,
  facingModeFromLocalTrack,
  LocalAudioTrack,
} from 'livekit-client';
import { useRef, useMemo, useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function PreJoin({
  defaults = {},
  onValidate,
  onSubmit,
  onError,
  debug,
  joinLabel = 'Join Room',
  micLabel = 'Microphone',
  camLabel = 'Camera',
  ...htmlProps
}: PreJoinProps) {
  // Initialize device settings
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(false);
  const [audioDeviceId, setAudioDeviceId] = useState<string>('');
  const [videoDeviceId, setVideoDeviceId] = useState<string>('');

  const tracks = usePreviewTracks(
    {
      audio: audioEnabled ? { deviceId: audioDeviceId } : false,
      video: videoEnabled ? { deviceId: videoDeviceId } : false,
    },
    onError,
  );

  const videoEl = useRef(null);

  const videoTrack = useMemo(
    () =>
      tracks?.filter(
        (track) => track.kind === Track.Kind.Video,
      )[0] as LocalVideoTrack,
    [tracks],
  );

  const facingMode = useMemo(() => {
    if (videoTrack) {
      const { facingMode } = facingModeFromLocalTrack(videoTrack);
      return facingMode;
    } else {
      return 'undefined';
    }
  }, [videoTrack]);

  const audioTrack = useMemo(
    () =>
      tracks?.filter(
        (track) => track.kind === Track.Kind.Audio,
      )[0] as LocalAudioTrack,
    [tracks],
  );

  const handleSubmit = () => {
    if (typeof onSubmit === 'function') {
      onSubmit({
        audioDeviceId,
        audioEnabled,
        videoDeviceId,
        videoEnabled,
        username: '',
        e2ee: false,
        sharedPassphrase: '',
      });
    }
  };

  useEffect(() => {
    if (videoEl.current && videoTrack) {
      videoTrack.unmute();
      videoTrack.attach(videoEl.current);
    }

    return () => {
      videoTrack?.detach();
    };
  }, [videoTrack]);

  return (
    <div className="lk-prejoin" {...htmlProps}>
      <div className="lk-video-container">
        {videoTrack && (
          <video
            ref={videoEl}
            width="1280"
            height="720"
            data-lk-facing-mode={facingMode}
          />
        )}
        {(!videoTrack || !videoEnabled) && (
          <div className="lk-camera-off-note">
            <ParticipantPlaceholder />
          </div>
        )}
      </div>
      <div className="lk-button-group-container">
        <div className="lk-button-group audio">
          <TrackToggle
            initialState={audioEnabled}
            source={Track.Source.Microphone}
            onChange={(enabled) => setAudioEnabled(enabled)}
          >
            {micLabel}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              initialSelection={audioDeviceId}
              kind="audioinput"
              disabled={!audioTrack}
              tracks={{ audioinput: audioTrack }}
              onActiveDeviceChange={(_, id) => setAudioDeviceId(id)}
            />
          </div>
        </div>
        <div className="lk-button-group video">
          <TrackToggle
            initialState={videoEnabled}
            source={Track.Source.Camera}
            onChange={(enabled) => setVideoEnabled(enabled)}
          >
            {camLabel}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              initialSelection={videoDeviceId}
              kind="videoinput"
              disabled={!videoTrack}
              tracks={{ videoinput: videoTrack }}
              onActiveDeviceChange={(_, id) => setVideoDeviceId(id)}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSubmit}>{joinLabel}</Button>
    </div>
  );
}
