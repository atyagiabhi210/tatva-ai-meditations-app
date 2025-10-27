import { colors } from "@/const/colors";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface Props extends TouchableOpacityProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode | string;
}

export function Button({ children, variant = "primary", ...props }: Props) {
  return (
    <TouchableOpacity
      style={props.style || styles.buttonContainer}
      activeOpacity={0.9}
      {...props}
    >
      {variant === "secondary" ? (
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.secondaryWrapper}
        >
          {typeof children === "string" ? (
            <Text style={styles.secondaryText}>{children}</Text>
          ) : (
            children
          )}
        </LinearGradient>
      ) : typeof children === "string" ? (
        <Text>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 10,
    marginTop: 8,
    overflow: "hidden",
  },
  secondaryWrapper: {
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryText: {
    color: "black",
  },
});

export default Button;
