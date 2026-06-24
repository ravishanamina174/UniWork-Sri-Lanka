import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { Home, Briefcase, User } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function GlassNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
    },
    {
      path: "/tasks",
      label: "Tasks",
      icon: Briefcase,
    },
    {
      path: "/about",
      label: "About",
      icon: User,
    },
  ];

  // Calculate widths to ensure the pointer matches exactly
  const navbarWidth = SCREEN_WIDTH * 0.88;
  const tabWidth = navbarWidth / navItems.length;

  // Find active tab, default to 0 if not found
  const currentIndex = navItems.findIndex((item) => item.path === pathname);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  // Shared value for the sliding animation
  const indicatorPosition = useSharedValue(activeIndex * tabWidth);

  // Trigger fluid spring animation when the active tab changes
  useEffect(() => {
    indicatorPosition.value = withSpring(activeIndex * tabWidth, {
      mass: 0.6,
      damping: 16,
      stiffness: 160,
      overshootClamping: false,
    });
  }, [activeIndex, tabWidth, indicatorPosition]);

  // Apply the sliding transform
  const animatedPointerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  return (
    <View style={styles.container} pointerEvents="box-none">
      <BlurView
        intensity={Platform.OS === "ios" ? 60 : 100}
        tint="light"
        style={styles.navbar}
      >
        {/* Apple Liquid Glass Lighting Effects */}
        <View style={styles.topHighlight} />
        <View style={styles.innerBorder} />

        {/* The Fluid Finger Pointer Effect */}
        <Animated.View style={[styles.slidingPointerContainer, animatedPointerStyle]}>
          <View style={styles.pointerPill} />
        </Animated.View>

        {/* Tab Items */}
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <TouchableOpacity
              key={item.path}
              activeOpacity={0.6}
              style={styles.tab}
              onPress={() => router.push(item.path as any)}
            >
              <View style={styles.iconContainer}>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  color={isActive ? "#0F172A" : "rgba(15, 23, 42, 0.5)"}
                />
              </View>

              <Text
                style={[
                  styles.label,
                  isActive && styles.activeLabel,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },

  navbar: {
    width: SCREEN_WIDTH * 0.88,
    height: 76, // Slightly taller to accommodate the fluid pill
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 38,
    overflow: "hidden",

    // More translucent background to let the pointer glow shine through
    backgroundColor:
      Platform.OS === "ios"
        ? "rgba(255, 255, 255, 0.2)"
        : "rgba(255, 255, 255, 0.85)",

    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 20,
  },

  topHighlight: {
    position: "absolute",
    top: 0,
    left: '10%',
    right: '10%',
    height: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 10,
    zIndex: 2,
  },

  innerBorder: {
    position: "absolute",
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 37,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    zIndex: 2,
  },

  // Sliding pointer styles
  slidingPointerContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: (SCREEN_WIDTH * 0.88) / 3, // Matches tabWidth
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  
  pointerPill: {
    width: 85,
    height: 50,
    borderRadius: 27,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // The liquid "glow"
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 5,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10, // Ensure taps register above the sliding pill
  },

  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop:-8
  },

  label: {
    marginTop: -5,
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(15, 23, 42, 0.5)",
  },

  activeLabel: {
    color: "#0F172A",
    fontWeight: "800",
  },
});