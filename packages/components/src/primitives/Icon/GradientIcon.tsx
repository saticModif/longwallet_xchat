import { LinearGradient } from "../../content";
import { Icon, IKeyOfIcons } from ".";


interface GradientIconProps {
    name: string;
    size?: number;
    startColor?: string;
    endColor?: string;
  }

  export const GradientIcon = ({ 
    name,
    size = 24,
    // startColor = '#2832E1',
    // endColor = '#A124E1'
    startColor = '#0473F9',
    endColor = '#0473F9'
  }: GradientIconProps) => {
    return (
      <LinearGradient
        colors={[startColor, endColor]}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Icon 
          name={name as IKeyOfIcons}
          size={size * 0.8}
          color="white"
        />
      </LinearGradient>
    );
  };