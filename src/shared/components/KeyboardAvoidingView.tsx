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
  const {bottom, top} = useSafeAreaInsets();

  const keyboardOffset = top + bottom;

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