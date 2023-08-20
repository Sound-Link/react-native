import { MutableRefObject, useState } from "react";
import { Audio } from "expo-av";
import WebView from "react-native-webview";
import { readAsStringAsync } from "expo-file-system";

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
    const uri = record?.getURI() || "";
    setRecord(null);
    await record?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const data = await readAsStringAsync(uri, {
      encoding: "base64",
    });

    webViewRef.current?.postMessage(JSON.stringify({ data }));
  }

  return { startRecording, stopRecording };
};
