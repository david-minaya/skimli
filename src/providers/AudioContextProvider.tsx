import { ReactNode, useState, createContext, useContext, useCallback } from 'react';

interface Props {
  children: ReactNode;
}

interface Node {
  node: MediaElementAudioSourceNode,
  gain: GainNode;
}

interface State {
  videoNode?: Node;
  audioNode?: Node;
}

interface ContextValue {
  context: AudioContext,
  videoNode?: Node;
  audioNode?: Node;
  addVideoNode: (video: HTMLVideoElement) => void;
  addAudioNode: (video: HTMLAudioElement) => void;
}

const Context = createContext({} as ContextValue);

let audioContext: AudioContext;

if (typeof window !== 'undefined') {
  audioContext = new AudioContext();
}

export function AudioContextProvider(props: Props) {

  const [state] = useState<State>({});

  const addVideoNode = useCallback((video: HTMLVideoElement) => {

    state.videoNode?.node.disconnect();
    state.videoNode?.gain.disconnect();

    const videoNode = audioContext.createMediaElementSource(video);
    const gainNode = audioContext.createGain();

    videoNode.connect(gainNode).connect(audioContext.destination);

    state.videoNode = {
      node: videoNode,
      gain: gainNode
    };
  }, []);

  const addAudioNode = useCallback((audio: HTMLAudioElement) => {

    state.audioNode?.node.disconnect();
    state.audioNode?.gain.disconnect();

    const audioNode = audioContext.createMediaElementSource(audio);
    const gainNode = audioContext.createGain();

    audioNode.connect(gainNode).connect(audioContext.destination);

    state.videoNode?.gain.gain.setValueAtTime(0.5, 0);
    gainNode.gain.setValueAtTime(0.5, 0);

    state.audioNode = {
      node: audioNode,
      gain: gainNode
    };
  }, []);

  const value = {
    context: audioContext,
    get videoNode() { return state.videoNode; },
    get audioNode() { return state.audioNode; },
    addVideoNode: addVideoNode,
    addAudioNode: addAudioNode
  };

  return (
    <Context.Provider value={value}>
      {props.children}
    </Context.Provider>
  );
}

export function useAudioContext() {
  return useContext(Context);
}
