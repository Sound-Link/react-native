import { MutableRefObject, useState } from "react";
import { Audio } from "expo-av";
import WebView from "react-native-webview";

export const useAudio = (webViewRef: MutableRefObject<WebView | null>) => {
  const [record, setRecord] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecord(recording);
  };

  async function stopRecording() {
    setRecord(null);
    await record?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = record?.getURI();
    webViewRef.current?.postMessage(JSON.stringify({ uri }));
  }

  return { startRecording, stopRecording };
};
