import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Design System Constants
const COLORS = {
  primary: '#068cf9',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  neutral: '#6b7280',
  background: '#ffffff',
  surface: '#f8fafc',
  border: '#e2e8f0',
  text: '#1e293b',
  placeholder: '#94a3b8',
};

const SIZES = {
  small: { height: 40, fontSize: 14, iconSize: 16, padding: 12 },
  medium: { height: 48, fontSize: 16, iconSize: 20, padding: 16 },
  large: { height: 56, fontSize: 18, iconSize: 24, padding: 20 },
};

export default function EnhancedInputField({
  label,
  value,
  onChangeText,
  placeholder,
  size = 'medium',
  variant = 'default',
  leftIcon,
  rightIcon,
  error,
  success,
  disabled = false,
  required = false,
  helperText,
  keyboardType = 'default',
  secureTextEntry = false,
  maxLength,
  onFocus,
  onBlur,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const sizeConfig = SIZES[size];
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  const hasValue = !!value;

  const getContainerStyle = () => {
    let borderColor = COLORS.border;
    let backgroundColor = COLORS.background;
    let shadowColor = 'transparent';

    if (disabled) {
      backgroundColor = COLORS.surface;
      borderColor = COLORS.border;
    } else if (hasError) {
      borderColor = COLORS.error;
      backgroundColor = '#fef2f2';
      shadowColor = COLORS.error;
    } else if (hasSuccess) {
      borderColor = COLORS.success;
      backgroundColor = '#f0fdf4';
      shadowColor = COLORS.success;
    } else if (isFocused) {
      borderColor = COLORS.primary;
      shadowColor = COLORS.primary;
    }

    return {
      ...styles.inputContainer,
      height: sizeConfig.height,
      borderColor,
      backgroundColor,
      shadowColor,
      shadowOpacity: isFocused || hasError || hasSuccess ? 0.15 : 0.05,
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getIconColor = () => {
    if (hasError) return COLORS.error;
    if (hasSuccess) return COLORS.success;
    if (isFocused) return COLORS.primary;
    return COLORS.neutral;
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={styles.fieldContainer}>
      {label && (
        <Text style={[styles.label, hasError && styles.labelError]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <MaterialIcons 
              name={leftIcon} 
              size={sizeConfig.iconSize} 
              color={getIconColor()} 
            />
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            {
              fontSize: sizeConfig.fontSize,
              paddingHorizontal: sizeConfig.padding,
              paddingLeft: leftIcon ? 8 : sizeConfig.padding,
              paddingRight: rightIcon || secureTextEntry ? 8 : sizeConfig.padding,
            }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !showPassword}
          maxLength={maxLength}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={COLORS.primary}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={sizeConfig.iconSize}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIconContainer}>
            <MaterialIcons 
              name={rightIcon} 
              size={sizeConfig.iconSize} 
              color={getIconColor()} 
            />
          </View>
        )}
        
        {hasSuccess && (
          <View style={styles.rightIconContainer}>
            <MaterialIcons 
              name="check-circle" 
              size={sizeConfig.iconSize} 
              color={COLORS.success} 
            />
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.25,
  },
  labelError: {
    color: COLORS.error,
  },
  required: {
    color: COLORS.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontWeight: '500',
  },
  leftIconContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  rightIconContainer: {
    paddingLeft: 8,
    paddingRight: 16,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.neutral,
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    color: COLORS.error,
    fontWeight: '500',
  },
});