import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { theme } from '../theme/colors';
import { styles } from '../styles/components/CarouselNavigation.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Navigation items with Dashboard first (Robinhood-style)
const NAVIGATION_ITEMS = [
  'Dashboard',
  'Transactions',
  'Categories',
  'Recurrings',
  'Cash Flow',
] as const;

type NavigationItem = typeof NAVIGATION_ITEMS[number];

interface CarouselNavigationProps {
  onNavigate: (item: NavigationItem) => void;
  initialItem?: NavigationItem;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  onNavigate,
  initialItem = 'Dashboard',
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(
    NAVIGATION_ITEMS.indexOf(initialItem)
  );
  
  // Animated values for each item
  const animatedValues = useRef(
    NAVIGATION_ITEMS.map(() => new Animated.Value(0))
  ).current;

  // Item width and spacing
  const ITEM_SPACING = 28;
  const ACTIVE_ITEM_WIDTH = 120;
  const INACTIVE_ITEM_WIDTH = 90;
  const LEFT_MARGIN = 20; // Robinhood-style left margin

  useEffect(() => {
    // Animate all items based on active index
    NAVIGATION_ITEMS.forEach((_, index) => {
      Animated.spring(animatedValues[index], {
        toValue: index === activeIndex ? 1 : 0,
        useNativeDriver: false,
        friction: 8,
        tension: 40,
      }).start();
    });
  }, [activeIndex]);

  const scrollToIndex = useCallback((index: number) => {
    if (scrollViewRef.current) {
      // Calculate the scroll position to align the active item to the left edge
      // Robinhood-style: selected tab aligns to left margin
      const scrollX = index * (INACTIVE_ITEM_WIDTH + ITEM_SPACING);
      
      scrollViewRef.current.scrollTo({
        x: Math.max(0, scrollX),
        animated: true,
      });
    }
  }, []);

  const handleItemPress = useCallback((index: number) => {
    setActiveIndex(index);
    onNavigate(NAVIGATION_ITEMS[index]);
    scrollToIndex(index);
  }, [onNavigate, scrollToIndex]);

  useEffect(() => {
    // Scroll to center the active item on mount
    setTimeout(() => {
      scrollToIndex(activeIndex);
    }, 100);
  }, [scrollToIndex, activeIndex]);

  const renderItem = (item: NavigationItem, index: number) => {
    const isActive = index === activeIndex;
    
    // Interpolate values for smooth animations
    const scale = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.85, 1],
    });

    const fontSize = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [14, 18],
    });

    const opacity = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });

    return (
      <TouchableOpacity
        key={item}
        activeOpacity={0.7}
        onPress={() => handleItemPress(index)}
        style={styles.itemContainer}
      >
        <Animated.View
          style={[
            styles.itemWrapper,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.itemText,
              {
                fontSize,
                color: isActive
                  ? theme.colors.primary.accent
                  : theme.colors.secondary.textSecondary,
                fontWeight: isActive ? '700' : '400',
              },
            ]}
            numberOfLines={1}
          >
            {item}
          </Animated.Text>
          {isActive && (
            <Animated.View
              style={[
                styles.activeIndicator,
                {
                  opacity: animatedValues[index],
                },
              ]}
            />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={INACTIVE_ITEM_WIDTH + ITEM_SPACING}
        snapToAlignment="start"
      >
        {/* Left margin for Robinhood-style alignment */}
        <View style={{ width: LEFT_MARGIN }} />
        
        {NAVIGATION_ITEMS.map((item, index) => renderItem(item, index))}
        
        {/* Right padding to allow last item to scroll to left */}
        <View style={{ width: SCREEN_WIDTH - ACTIVE_ITEM_WIDTH - LEFT_MARGIN }} />
      </ScrollView>
    </View>
  );
};

export default CarouselNavigation;
export type { NavigationItem, CarouselNavigationProps };