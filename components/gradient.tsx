import {
  Blur,
  Canvas,
  RadialGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
const { width, height } = Dimensions.get("screen");
const Colors = {
  white: "#ffffff",
  teal: "#5AC8FA",
  mediumBlue: "#007aff",
  lightBlue: "#4da6ff",
  iceBlue: "#E6F4FE",
};

const VISUAL_CONFIG = {
  blur: 10,
  mode: "clamp",
  colors: [
    Colors.mediumBlue,
    Colors.lightBlue,
    Colors.teal,
    Colors.iceBlue,
    Colors.white,
  ],
  center: {
    x: width / 2,
    y: height / 2,
  },
};
const RADIUS_CONFIG = {
  minScale: 0.6,
  maxScale: 1.4,
  speakingScale: 1,
  quietScale: 0.5,
  borderRadius: {
    default: width,
    speaking: width / 4,
  },
};

const ANIMATION_CONFIG = {
  durations: {
    MOUNT: 2000,
    SPEAKING_TRANSITION: 600,
    QUIET_TRANSITION: 400,
    PULSE: 1000,
  },
  spring: {
    damping: 10,
    stiffness: 50,
  },
};
type GradientPosition = "top" | "center" | "bottom";
type GradientProps = {
  position: GradientPosition;
  isSpeaking: boolean;
};
function getTargetY(position: GradientPosition) {
  if (position === "top") {
    return 0;
  } else if (position === "center") {
    return height / 2;
  } else if (position === "bottom") {
    return height;
  }
  return 0;
}
function calculateRadiusBounds(baseRadiusValue: number) {
  "worklet";
  return {
    min: baseRadiusValue * RADIUS_CONFIG.minScale,
    max: baseRadiusValue * RADIUS_CONFIG.maxScale,
  };
}
function calculateRadius(baseRadiusValue: number, isSpeaking: boolean) {
  "worklet";
  const { min, max } = calculateRadiusBounds(baseRadiusValue);
  const scale = isSpeaking
    ? RADIUS_CONFIG.speakingScale
    : RADIUS_CONFIG.quietScale;
  return min + (max - min) * scale;
}
const Gradient = ({ position, isSpeaking }: GradientProps) => {
  const animatedY = useSharedValue(0);
  const radiusScale = useSharedValue(1);
  const baseRadiusValue = useSharedValue(RADIUS_CONFIG.borderRadius.default);
  const mountRadius = useSharedValue(0);
  const animatedRadius = useDerivedValue(() => {
    const { min, max } = calculateRadiusBounds(baseRadiusValue.value);
    const calculatedRadius = min + (max - min) * radiusScale.value;
    return mountRadius.value < calculatedRadius
      ? mountRadius.value
      : calculatedRadius;
  });
  const center = useDerivedValue(() => {
    return vec(VISUAL_CONFIG.center.x, animatedY.value);
  });

  useEffect(() => {
    animatedY.value = getTargetY(position);
  });

  useEffect(() => {
    const targetY = getTargetY(position);
    animatedY.value = withSpring(targetY, ANIMATION_CONFIG.spring);
  }, [position]);

  useEffect(() => {
    const targetRadius = calculateRadius(baseRadiusValue.value, isSpeaking);
    mountRadius.value = withTiming(
      targetRadius,
      ANIMATION_CONFIG.durations.MOUNT as any
    );
  });
  useEffect(() => {
    const duration = ANIMATION_CONFIG.durations.SPEAKING_TRANSITION;
    if (isSpeaking) {
      baseRadiusValue.value = withTiming(
        RADIUS_CONFIG.borderRadius.speaking,
        duration as any
      );
      animatedY.value = withTiming(getTargetY("center"), duration as any);
    } else {
      baseRadiusValue.value = withTiming(
        RADIUS_CONFIG.borderRadius.default,
        duration as any
      );
      animatedY.value = withTiming(getTargetY(position), duration as any);
    }
  }, [isSpeaking, baseRadiusValue, animatedY, radiusScale]);

  useEffect(() => {
    if (isSpeaking) {
      radiusScale.value = withRepeat(
        withTiming(RADIUS_CONFIG.speakingScale, {
          duration: ANIMATION_CONFIG.durations.PULSE,
        }),
        -1,
        true
      );
    } else {
      radiusScale.value = withTiming(RADIUS_CONFIG.quietScale, {
        duration: ANIMATION_CONFIG.durations.QUIET_TRANSITION as any,
      });
    }
  }, [isSpeaking, radiusScale]);
  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={center}
            r={animatedRadius}
            colors={VISUAL_CONFIG.colors}
          />
          <Blur blur={VISUAL_CONFIG.blur} mode={VISUAL_CONFIG.mode as any} />
        </Rect>
      </Canvas>
    </View>
  );
};

export default Gradient;
