import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
} from 'react-native-svg';

export function UniWorkMark({ size = 28, color = '#37352f' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Path
        d="M50 10L85 28V72L50 90L15 72V28L50 10Z"
        stroke={color}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <Path d="M15 28L50 48L85 28" stroke={color} strokeWidth="7" strokeLinejoin="round" />
      <Path d="M50 48V90" stroke={color} strokeWidth="7" strokeLinejoin="round" />
      <Path
        d="M62 43V60C62 65 73 65 73 60V38"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function GoogleGlyph({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <Path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <Path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <Path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.6 7.1l6.3 5.3C37.5 38.3 44 33 44 24c0-1.2-.1-2.3-.4-3.5z"
      />
    </Svg>
  );
}

export default function SignInArtwork() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.doodle, { top: '8%', left: '6%', opacity: 0.55, transform: [{ rotate: '-8deg' }] }]}>
        <Svg width={44} height={34} viewBox="0 0 60 45" fill="none">
          <Path d="M8 35 L5 12 L20 22 L30 8 L40 22 L55 12 L52 35 Z" stroke="#64748B" strokeWidth="1.5" />
          <Circle cx="5" cy="10" r="1.5" fill="#64748B" />
          <Circle cx="30" cy="6" r="1.5" fill="#64748B" />
          <Circle cx="55" cy="10" r="1.5" fill="#64748B" />
          <Line x1="10" y1="39" x2="50" y2="39" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2 2" />
        </Svg>
      </View>

      <View style={[styles.doodle, { top: '16%', left: '3%', opacity: 0.4, transform: [{ rotate: '-15deg' }] }]}>
        <Svg width={42} height={42} viewBox="0 0 60 60" fill="none">
          <Path d="M15 10 Q 35 15, 38 38" stroke="#94A3B8" strokeWidth="1.5" />
          <Path d="M28 36 L38 38 L38 28" stroke="#94A3B8" strokeWidth="1.5" />
        </Svg>
      </View>

      <View style={[styles.doodle, { top: '26%', left: '10%', opacity: 0.5, transform: [{ rotate: '6deg' }] }]}>
        <Svg width={38} height={38} viewBox="0 0 50 50" fill="none">
          <Polyline points="16 14 6 25 16 36" stroke="#64748B" strokeWidth="1.5" />
          <Polyline points="34 14 44 25 34 36" stroke="#64748B" strokeWidth="1.5" />
          <Line x1="28" y1="12" x2="22" y2="38" stroke="#64748B" strokeWidth="1.5" />
        </Svg>
      </View>

      <View style={[styles.doodle, { top: '40%', left: '4%', opacity: 0.55, transform: [{ rotate: '-10deg' }] }]}>
        <Svg width={44} height={60} viewBox="0 0 60 80" fill="none">
          <Path
            d="M20 50 C12 42 10 30 18 20 C26 10 38 10 44 20 C50 30 48 42 40 50 L40 58 L20 58 Z"
            stroke="#64748B"
            strokeWidth="1.5"
          />
          <Line x1="24" y1="64" x2="36" y2="64" stroke="#64748B" strokeWidth="1.5" />
          <Line x1="27" y1="69" x2="33" y2="69" stroke="#64748B" strokeWidth="1.5" />
        </Svg>
      </View>

      <View style={[styles.doodle, { bottom: '18%', left: '8%', opacity: 0.45 }]}>
        <Svg width={58} height={58} viewBox="0 0 80 80" fill="none">
          <Circle cx="40" cy="40" r="24" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
          <Line x1="40" y1="5" x2="40" y2="75" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
          <Line x1="5" y1="40" x2="75" y2="40" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
        </Svg>
      </View>

      <View style={[styles.doodle, { bottom: '7%', left: '16%', opacity: 0.5, transform: [{ rotate: '5deg' }] }]}>
        <Svg width={42} height={34} viewBox="0 0 60 45" fill="none">
          <Polygon points="30,5 55,18 30,31 5,18" stroke="#64748B" strokeWidth="1.5" />
          <Path d="M14 23 V34 C14 34, 20 39, 30 39 C40 39, 46 34, 46 34 V23" stroke="#64748B" strokeWidth="1.5" />
        </Svg>
      </View>

      <View style={[styles.doodle, { top: '7%', right: '6%', opacity: 0.7 }]}>
        <Svg width={110} height={110} viewBox="0 0 120 120" fill="none">
          <Path
            d="M15 95 Q 40 90, 55 55 T 90 30"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <Polygon
            points="75,32 115,10 99,50 93,36"
            fill="#F8FAFC"
            stroke="#64748B"
            strokeWidth="1.5"
          />
        </Svg>
      </View>

      <View style={[styles.doodle, { top: '22%', right: '10%', opacity: 0.55, transform: [{ rotate: '-10deg' }] }]}>
        <Svg width={36} height={36} viewBox="0 0 45 45" fill="none">
          <Rect x="6" y="6" width="33" height="33" rx="5" stroke="#64748B" strokeWidth="1.5" strokeDasharray="30 4" />
          <Path d="M14 22 L20 28 L32 14" stroke="#475569" strokeWidth="2" />
        </Svg>
      </View>

      <View style={[styles.doodle, { top: '42%', right: '8%', opacity: 0.5, transform: [{ rotate: '12deg' }] }]}>
        <Svg width={36} height={36} viewBox="0 0 50 50" fill="none">
          <Path
            d="M25 5 L31 18 L45 19 L34 28 L38 42 L25 34 L12 42 L16 28 L5 19 L19 18 Z"
            stroke="#64748B"
            strokeWidth="1.5"
          />
        </Svg>
      </View>

      <View style={[styles.doodle, { bottom: '10%', right: '6%', opacity: 0.7 }]}>
        <Svg width={96} height={96} viewBox="0 0 100 100" fill="none">
          <Circle cx="45" cy="55" r="28" stroke="#CBD5E1" strokeWidth="1.5" />
          <Circle cx="45" cy="55" r="18" stroke="#94A3B8" strokeWidth="1.5" fill="#FEE2E2" fillOpacity="0.3" />
          <Circle cx="45" cy="55" r="7" stroke="#64748B" strokeWidth="1.5" fill="#FB7185" fillOpacity="0.4" />
        </Svg>
      </View>

      <View style={[styles.doodle, { bottom: '24%', right: '4%', opacity: 0.5, transform: [{ rotate: '-10deg' }] }]}>
        <Svg width={28} height={40} viewBox="0 0 40 55" fill="none">
          <Polygon
            points="22,2 6,28 20,28 14,52 34,20 20,20"
            stroke="#64748B"
            strokeWidth="1.5"
            fill="#FEF08A"
            fillOpacity="0.3"
          />
        </Svg>
      </View>

      <View style={[styles.doodle, { bottom: '6%', right: '22%', opacity: 0.4, transform: [{ rotate: '10deg' }] }]}>
        <Svg width={36} height={36} viewBox="0 0 45 45" fill="none">
          <Circle cx="22" cy="22" r="17" stroke="#94A3B8" strokeWidth="1.5" />
          <Ellipse cx="22" cy="22" rx="7" ry="17" stroke="#94A3B8" strokeWidth="1.5" />
          <Line x1="5" y1="22" x2="39" y2="22" stroke="#94A3B8" strokeWidth="1.5" />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  doodle: {
    position: 'absolute',
  },
});
