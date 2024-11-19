import React, { useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { useAuthRequest } from "expo-auth-session/providers/google";

// Kích hoạt WebBrowser
WebBrowser.maybeCompleteAuthSession();

export default function SigninGg() {
    const redirectUri = makeRedirectUri({
        useProxy: true, // Sử dụng proxy của Expo
    });
    console.log("redirectUri: ", redirectUri);
  // Tạo yêu cầu OAuth với Google
  const [request, response, promptAsync] = useAuthRequest({
    clientId: "605777517558-ojtuhupen9p211juela7o4k8gb4sf378.apps.googleusercontent.com",
    // redirectUri: redirectUri,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("Login successful:", response.params);
      // Xử lý token
      const { access_token } = response.params;
      console.log("Access Token:", access_token);
    } else if (response) {
      console.error("Login error or cancelled:", response);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Button
        title="Login with Google"
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
