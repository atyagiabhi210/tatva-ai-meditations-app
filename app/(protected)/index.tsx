import { SignOutButton } from "@/components/clerk/SignOutButton";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Protected Screen</Text>
      <SignOutButton />
    </View>
  );
}
