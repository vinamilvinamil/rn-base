import { useHeaderHeight } from 'expo-router/build/react-navigation';
import React from 'react';
import {
    KeyboardAvoidingViewProps,
    Platform,
    KeyboardAvoidingView as RNKeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props extends KeyboardAvoidingViewProps {
  children: React.ReactNode;
}

export const KeyboardAvoidingView = ({
  children,
  ...props
}: Props) => {
  const headerHeight = useHeaderHeight();
  const {bottom} = useSafeAreaInsets();

  const keyboardOffset = headerHeight + bottom;

  return (
    <RNKeyboardAvoidingView
      {...props}
      style={props.style}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
      keyboardVerticalOffset={keyboardOffset}
    >
      {children}
    </RNKeyboardAvoidingView>
  );
};