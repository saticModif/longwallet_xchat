import { FC } from 'react';
import { ThemeableStack, getTokenValue } from 'tamagui';
import { LinearGradient } from '../../content/LinearGradient';
import { SizableText } from '../SizeableText';
import type { IButtonProps } from '../Button';

const GradientButton: FC<IButtonProps> = ({ 
    children, 
    size = 'medium',
    style,
    ...props 
}) => {
    const sizeStyles = {
      small: { py: '$1', px: '$2.5', borderRadius: getTokenValue('$size.2') },
      medium: { py: '$1.5', px: '$3.5', borderRadius: getTokenValue('$size.2') },
      large: { py: '$3', px: '$5', borderRadius: getTokenValue('$size.3') },
    }[size];
     return (
     <ThemeableStack
       {...sizeStyles}
       {...props}
       style={[{ overflow: 'hidden', width: '100%' }, style]}
       pressStyle={{ opacity: 0.8 }}
       hoverStyle={{ opacity: 0.9 }}
     >
       <LinearGradient
         colors={['#0473F9', '#0473F9']}
         start={{ x: 0, y: 0.5 }}
         end={{ x: 1, y: 0.5 }}
         style={{
           position: 'absolute',
           left: 0,
           right: 0,
           top: 0,
           bottom: 0,
         }}
       />
       <SizableText 
         size={size === 'small' ? '$bodyMdMedium' : '$bodyLgMedium'}
         color="#fff" 
         textAlign="center"
       >
         {children}
       </SizableText>
     </ThemeableStack>
   );
};

export default GradientButton;