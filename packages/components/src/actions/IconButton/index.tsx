import React, { useCallback } from 'react';
import { LinearGradient } from '../../content';
import {
  ButtonFrame,
  Icon,
  Spinner,
  Stack,
  getSharedButtonStyles,
  SizableText,
  XStack,
} from '../../primitives';
import { useSharedPress } from '../../primitives/Button/useEvent';
import { NATIVE_HIT_SLOP } from '../../utils';
import { Tooltip } from '../Tooltip';

import type { IButtonProps, IIconProps, IKeyOfIcons } from '../../primitives';
import type { ITooltipProps } from '../Tooltip';
import type { GestureResponderEvent } from 'react-native';

export interface IIconButtonProps
  extends Omit<IButtonProps, 'iconAfter' | 'children' | 'icon'> {
  icon: IKeyOfIcons;
  iconSize?: IIconProps['size'];
  iconProps?: IIconProps;
  title?: ITooltipProps['renderContent'];
  // Allow triggering via the Enter or Space key.
  hotKey?: boolean;
  titlePlacement?: ITooltipProps['placement'];
  gradientBackground?: boolean;
  color?: string;
}

const sizes = {
  small: {
    p: '$1',
    negativeMargin: -5,
  },
  medium: {
    p: '$1.5',
    negativeMargin: -7,
  },
  large: {
    p: '$3',
    negativeMargin: -13,
  },
};

const getSizeStyles = (size: IButtonProps['size']) =>
  sizes[size || 'medium'] || sizes.medium;

export const IconButton = (props: IIconButtonProps) => {
  const {
    iconSize,
    disabled,
    loading,
    title,
    icon,
    iconProps,
    size,
    variant = 'secondary',
    hotKey = false,
    titlePlacement = 'top',
    label,
    gradientBackground,
    color,
    ...rest
  } = props;

  const { p, negativeMargin } = getSizeStyles(size);

  const { sharedFrameStyles, iconColor } = getSharedButtonStyles({
    disabled,
    loading,
    variant,
  });

  const { onPress, onLongPress } = useSharedPress(rest);

  const onKeyDown = useCallback((event: GestureResponderEvent) => {
    event.preventDefault();
  }, []);

  const renderIconButton = () => {
    const buttonContent = loading ? (
      <Stack
        {...(size !== 'small' && {
          m: '$0.5',
        })}
      >
        <Spinner color={iconColor} size="small" />
      </Stack>
    ) : (
      <XStack alignItems="center">
        <Icon
          color={color ?? iconColor}
          name={icon}
          size={iconSize || (size === 'small' ? '$5' : '$6')}
          {...iconProps}
        />
        {label && <SizableText size="$headingSm">{label}</SizableText>}
      </XStack>
    );
    const button = (
      <ButtonFrame
        p={p}
        borderRadius="$full"
        disabled={!!disabled || !!loading}
        aria-disabled={!!disabled || !!loading}
        // @ts-expect-error
        onKeyDown={hotKey ? undefined : onKeyDown}
        hitSlop={size === 'small' ? NATIVE_HIT_SLOP : undefined}
        {...(variant === 'tertiary' && {
          m: negativeMargin,
        })}
        {...sharedFrameStyles}
        {...rest}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        {buttonContent}
      </ButtonFrame>
    );
    if (gradientBackground) {
      return (
        <LinearGradient
          // colors={['#2832E1', '#A124E1']}
          colors={['#0473F9', '#0473F9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 9999 }}
        >
          {button}
        </LinearGradient>
      );
    }
    return button;
  };

  if (title) {
    return (
      <Tooltip
        renderTrigger={renderIconButton()}
        renderContent={title}
        placement={titlePlacement}
        {...(variant === 'tertiary' && { offset: 12 })}
      />
    );
  }

  return renderIconButton();
};
