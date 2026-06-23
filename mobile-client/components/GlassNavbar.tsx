import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import { Home, Briefcase, User } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GlassNavbar() {
  const router = useRouter();
  const currentPath = usePathname();

  // Navigation config array matching paths, icons, and labels
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/tasks', label: 'Tasks', icon: Briefcase },
    { path: '/about', label: 'About', icon: User },
  ];

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <BlurView 
        intensity={Platform.OS === 'ios' ? 75 : 100} 
        tint="light" 
        style={styles.navbarCanvas}
      >
        {navItems.map((item) => {
          // Check if current route is active
          const isActive = currentPath === item.path;
          const IconComponent = item.icon;

          return (
            <TouchableOpacity
              key={item.path}
              style={styles.navButton}
              activeOpacity={0.7}
              onPress={() => router.push(item.path as any)}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                <IconComponent 
                  size={20} 
                  color={isActive ? '#007FFF' : '#64748B'} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
              </View>
              <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>
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
  outerContainer: {
    position: 'absolute',
    bottom: 24, // Floating offset from the bottom of the viewport
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999, // Ensure it floats completely over everything
  },
  navbarCanvas: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.88, // Sleek, modern compact floating pill width
    height: 64,
    borderRadius: 32,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.35)',
    overflow: 'hidden',
    // Premium soft lift drop shadow
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    flex: 1,
  },
  iconWrapper: {
    padding: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(0, 127, 255, 0.08)', // Subtle structural highlight glow
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  activeNavLabel: {
    color: '#007FFF',
    fontWeight: '700',
  },
});