import { useMemo } from 'react';

import {
  ThemeableStack,
  getTokenValue,
  styled,
  useProps,
  withStaticProperties,
} from 'tamagui';

import { Icon } from '../Icon';
import { SizableText } from '../SizeableText';
import { Spinner } from '../Spinner';

import { useSharedPress } from './useEvent';

import type { IIconProps, IKeyOfIcons } from '../Icon';
import type { ColorTokens, FontSizeTokens, ThemeableStackProps } from 'tamagui';
import { GestureResponderEvent, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from '../../content';

export interface IButtonProps extends ThemeableStackProps {
  size?: 'small' | 'medium' | 'large';
  variant?:
    | 'secondary'
    | 'tertiary'
    | 'primary'
    | 'destructive'
    | 'gradient'
    | 'outline'
    | 'transparent';
  icon?: IKeyOfIcons;
  iconAfter?: IKeyOfIcons;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  color?: ColorTokens;
  iconColor?: ColorTokens;
  textAlign?: 'left' | 'center' | 'right';
  /**
   * stop propagation from button.
   *
   * @default true
   */
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  stopPropagation?: boolean;
  onPressDebounce?: number;
}

const BUTTON_VARIANTS: Record<
  Exclude<IButtonProps['variant'], undefined>,
  {
    color: ColorTokens;
    iconColor: ColorTokens;
    bg: ColorTokens;
    hoverBg: ColorTokens;
    activeBg: ColorTokens;
    focusRingColor: ColorTokens;
    borderColor?: ColorTokens;
    isGradient?: boolean;
  }
> = {
  primary: {
    color: '$textInverse',
    iconColor: '$iconInverse',
    bg: '$bgPrimary',
    hoverBg: '$bgPrimaryHover',
    activeBg: '$bgPrimaryActive',
    focusRingColor: '$focusRing',
  },
  tertiary: {
    color: '$textSubdued',
    iconColor: '$bgReverse',
    bg: '$transparent',
    hoverBg: '$bgHover',
    activeBg: '$bgActive',
    focusRingColor: '$focusRing',
  },
  destructive: {
    color: '$textOnColor',
    iconColor: '$iconOnColor',
    bg: '$bgCriticalStrong',
    hoverBg: '$bgCriticalStrongHover',
    activeBg: '$bgCriticalStrongActive',
    focusRingColor: '$focusRingCritical',
  },
  secondary: {
    color: '$text',
    iconColor: '$icon',
    bg: '$bgStrong',
    hoverBg: '$bgStrongHover',
    activeBg: '$bgStrongActive',
    focusRingColor: '$focusRing',
  },
  gradient: {
    color: '$bgReverse',
    iconColor: '$iconInverse',
    bg: '$transparent',
    hoverBg: '$transparent',
    activeBg: '$transparent',
    focusRingColor: '$focusRing',
    isGradient: true,
  },
  outline: {
    color: '$bgReverse',
    iconColor: '$icon',
    bg: '$transparent',
    hoverBg: '$transparent',
    activeBg: '$transparent',
    focusRingColor: '$focusRing',
    borderColor: '$borderPrimary',
  },
  transparent: {
    color: '$bgReverse',
    iconColor: '$icon',
    bg: '$transparent',
    hoverBg: '$transparent',
    activeBg: '$transparent',
    focusRingColor: '$focusRing',
    borderColor: '$borderPrimary',
  },
};

export const getSharedButtonStyles = ({
  variant,
  disabled,
  loading,
}: Partial<IButtonProps>) => {
  const { iconColor, color, bg, hoverBg, activeBg, focusRingColor } =
    BUTTON_VARIANTS[variant || 'secondary'];

  const sharedFrameStyles = {
    bg,
    borderWidth: variant === 'outline' ? 1 : '$px',
    borderColor: variant === 'outline' ? '#3471FE' : '$transparent',
    ...(!disabled && !loading
      ? {
          hoverStyle: { bg: hoverBg },
          pressStyle: { bg: activeBg },
          focusable: true,
          focusVisibleStyle: {
            outlineColor: focusRingColor,
            outlineStyle: 'solid',
            outlineWidth: 2,
          },
        }
      : {
          opacity: 0.5,
        }),
  };

  return {
    color,
    iconColor,
    sharedFrameStyles,
  };
};

const useSizeStyles = (size: IButtonProps['size']) =>
  useMemo(() => {
    const sizes = {
      small: {
        py: '$2',
        px: '$2.5',
        borderRadius: getTokenValue('$size.2'),
        textVariant: '$bodyMdMedium',
      },
      medium: {
        py: '$2.5',
        px: '$3.5',
        borderRadius: getTokenValue('$size.2'),
        textVariant: '$bodyLgMedium',
      },
      large: {
        py: '$4',
        px: '$5',
        borderRadius: getTokenValue('$size.3'),
        textVariant: '$bodyLgMedium',
      },
    };
    return sizes[size || 'medium'] || sizes.medium;
  }, [size]);

export const ButtonFrame = styled(ThemeableStack, {
  tag: 'button',
  role: 'button',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

function ButtonIcon({
  variant,
  size,
  ...props
}: Pick<IButtonProps, 'variant' | 'size'> & Omit<IIconProps, 'size'>) {
  return <Icon size={size === 'small' ? '$4.5' : '$5'} {...props} />;
}

type ISharedFrameStylesProps = {
  hoverStyle: {
    bg: ColorTokens;
  };
  pressStyle: {
    bg: ColorTokens;
  };
  focusable: boolean;
  focusVisibleStyle: {
    outlineColor: ColorTokens;
    outlineStyle: string;
    outlineWidth: number;
  };
  bg: ColorTokens;
  borderWidth: string;
  borderColor: string;
};

const ButtonComponent = ButtonFrame.styleable<IButtonProps>((props, ref) => {
  const {
    size = 'medium',
    icon,
    iconAfter,
    disabled,
    loading,
    children,
    color: outerColor,
    iconColor: outerIconColor,
    variant = 'secondary',
    textAlign,
    ...rest
  } = useProps(props, {});

  const { py, px, borderRadius, textVariant } = useSizeStyles(size);

  const { sharedFrameStyles, iconColor, color } = getSharedButtonStyles({
    variant,
    disabled,
    loading,
  }) as {
    sharedFrameStyles: ISharedFrameStylesProps;
    iconColor: ColorTokens;
    color: ColorTokens;
  };

  const { onPress, onLongPress } = useSharedPress(rest);
  const isGradient = variant === 'gradient';

  return (
    <ButtonFrame
      ref={ref}
      my={variant === 'tertiary' ? -5 : '$0'}
      mx={variant === 'tertiary' ? -9 : '$0'}
      py={variant === 'tertiary' ? '$1' : py}
      px={variant === 'tertiary' ? '$2' : px}
      borderRadius={borderRadius}
      borderCurve="continuous"
      disabled={!!disabled || !!loading}
      aria-disabled={!!disabled || !!loading}
      {...sharedFrameStyles}
      hoverStyle={{
        ...sharedFrameStyles.hoverStyle,
        ...props.hoverStyle,
      }}
      focusVisibleStyle={{
        ...sharedFrameStyles.focusVisibleStyle,
        ...props.focusVisibleStyle,
      }}
      pressStyle={{
        ...sharedFrameStyles.pressStyle,
        ...props.pressStyle,
      }}
      {...rest}
      onPress={onPress}
      onLongPress={onLongPress}
      position="relative"
    >
      {isGradient && (
        <LinearGradient
          colors={['#0473F9', '#0473F9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            borderRadius: borderRadius,
          }}
        />
      )}
      {icon && !loading ? (
        <ButtonIcon
          name={icon}
          variant={variant}
          size={size}
          mr="$2"
          color={outerIconColor || iconColor}
        />
      ) : null}
      {loading ? (
        <Spinner size="small" mr="$2" color={outerIconColor || iconColor} />
      ) : null}
      <SizableText
        textAlign={textAlign}
        size={textVariant as FontSizeTokens}
        color={outerColor || color}
      >
        {children}
      </SizableText>
      {iconAfter ? (
        <ButtonIcon
          name={iconAfter}
          variant={variant}
          size={size}
          ml="$2"
          color={outerIconColor || iconColor}
        />
      ) : null}
    </ButtonFrame>
  );
});

export const Button = withStaticProperties(ButtonComponent, {});
