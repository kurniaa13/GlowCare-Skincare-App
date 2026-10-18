import React from 'react';
import { Pressable, Text } from 'react-native';
import { buttonStyles } from '@/styles';

interface PageButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';
  disabled?: boolean;
}

export const PageButton: React.FC<PageButtonProps> = ({
  title,
  onPress,
  variant = 'solid',
  disabled = false,
}) => {
  const isOutline = variant === 'outline';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        buttonStyles.button,
        isOutline && buttonStyles.buttonOutline,
        disabled && buttonStyles.buttonDisabled,
        pressed && buttonStyles.buttonPressed,
      ]}
    >
      <Text style={[buttonStyles.text, isOutline && !disabled && buttonStyles.textOutline]}>
        {title}
      </Text>
    </Pressable>
  );
};
