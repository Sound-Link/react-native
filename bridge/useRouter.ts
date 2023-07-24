import { MutableRefObject, useEffect } from "react";
import { BackHandler, Platform } from "react-native";
import WebView from "react-native-webview";

interface UseRouterProps {
  webViewRef: MutableRefObject<WebView | null>;
  historyStack: MutableRefObject<number>;
}

export const useRouter = ({ historyStack, webViewRef }: UseRouterProps) => {
  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      if (historyStack.current === 0) {
        return false;
      }
      historyStack.current =
        historyStack.current === 0 ? 0 : historyStack.current - 1;
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          "hardwareBackPress",
          onAndroidBackPress
        );
      };
    }
  }, []);

  return { onAndroidBackPress };
};
